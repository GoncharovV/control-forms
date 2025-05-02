import { EventEmitter, FormEvent, ReadonlyEventEmitter } from '../events';
import { id, mergeArrays } from '../utils';
import { validateBySchema, ValidationError, ValidationResult, Validator } from '../validation';
import { AbstractControlGroup } from './abstract-control-group';
import { AbstractControlEvent, ControlId, ValidationMode } from './types';


export interface AbstractControlOptions {
  /**
	 * It only used for HTML attribute "disabled"
	 * 
	 * Control value **can still be changed programmatically**.
	 * And included in parent control aggregated value
	 * 
	 * ---
	 * 
	 * Unlike Angular Forms, where value of disabled control is excluded from parent group aggregate value
	 */
  isDisabled?: boolean;

  /**
	 * Set of validation function which will be applied to the control value.  
	 * The time when validators are called is determined by the `mode`
	 * 
	 * Package provides set of simple validators: 
	 * `Validators.required()`, `Validators.minLength(...)`, `Validators.maxLength(...)`;
	 * 
	 * For more complex validation we recommend to use special libraries like `Zod`, ~`Yup`~ and other.  
	 * 
	 * **Note that Zod validation format is supported by default.**  
	 * You can use it out of the box:
	 * @example
	 * ```ts
	 * new FormControl('', { validators: [z.string().min(5).max(10)] })
	 * ```
	 * 
	 * And even async validators are supported:
	 * 
	 * @example
	 * ```ts
	 * const emailControl = new FormControl('', { validators: [
	 *     z.string().refine(() => { return api.checkExistance() })
	 * ]})
	 * ```
	 * 
	 * @see https://zod.dev/
	 */
  validators?: Validator | Validator[];

  /**
	 * Validation mode shows when the control will be validated
	 * 
	 * `none` – control will never be validated
	 * 
	 * `onBlur` – when field stop being focused

	 * `onChange` - each time value changes
	 * 
	 * `onSubmit` – when parent `ControlGroup` submitted
	 * 
	 * ---
	 *
	 * **IMPORTANT:**
	 * 
	 * Usually it's not necessary to explicitly specify the `mode` for each control
	 * 
	 * If `mode` is provided for parent `ControlGroup` **but not provided** for current control,
	 * parent value of validation mode **will be inherited**
	 * 
	 * **Default value** for control with provided `validators` is `'onSubmit'`.
	 * 
	 * ---
	 * 
	 * You can override `mode` anytime by using `control.setValidationMode(...)`
	 */
  mode?: ValidationMode;

  id?: ControlId;
}

export abstract class AbstractControl<
  TValue = any,
  TEvents extends FormEvent = any,
> {

  public readonly id: ControlId;

  public abstract get value(): TValue;

  private _isDirty = false;

  private _isTouched = false;

  private _isFocused = false;

  private _isValidating = false;

  private _isDisabled = false;

  private _parent: AbstractControlGroup | null = null;

  private _validationMode?: ValidationMode | null = null;

  private validators: Validator[] = [];

  protected readonly emitter = new EventEmitter<AbstractControlEvent | TEvents>();

  public get events(): ReadonlyEventEmitter<AbstractControlEvent | TEvents> {
    return this.emitter;
  }

  protected get children(): AbstractControl<any>[] {
    return [];
  }

  /**
     * Shows value was changed by user
     */
  public get isDirty() {
    return this._isDirty;
  }

  /**
     * Shows form control was focused
     */
  public get isTouched() {
    return this._isTouched;
  }

  public get isFocused() {
    return this._isFocused;
  }

  public get isValidating() {
    return this._isValidating;
  }

  /**
	 * It only used for HTML attribute "disabled"
	 * 
	 * Control value **can still be changed programmatically**.
	 * And included in parent control aggregate value
	 * 
	 * ---
	 * 
	 * Unlike Angular Forms, where value of disabled control is excluded from parent group aggregated value
	 */
  public get isDisabled() {
    return this._isDisabled;
  }

  /**
	 * Opposite of `isDisabled`
	 */
  public get isEnabled() {
    return !this.isDisabled;
  }

  public get parent() {
    return this._parent;
  }

  private _validationErrors: ValidationError[] = [];

  /**
	 * If `true` – control has no validations errors
	 */
  public get isValid() {
    return this._validationErrors.length === 0;
  }

  /**
	 * If `true` – control has validations errors
	 */
  public get isInvalid() {
    return !this.isValid;
  }

  public get errors() {
    return this._validationErrors;
  }

  public getValidationMode() {
    return this._validationMode;
  }

  constructor(private _options: AbstractControlOptions = {}) {
    this.setOptions(_options);

    this.id = _options.id || id();

    this._bindMethods();
  }

  private _bindMethods() {
    this.setValue = this.setValue.bind(this);

    this.markAllAsDirty = this.markAllAsDirty.bind(this);
    this.markAllAsTouched = this.markAllAsTouched.bind(this);
    this.setTouched = this.setTouched.bind(this);
    this.setFocused = this.setFocused.bind(this);
    this.setDirty = this.setDirty.bind(this);

    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);

    this.validate = this.validate.bind(this);
    this.getValidationMode = this.getValidationMode.bind(this);
    this.clearErrors = this.clearErrors.bind(this);

    this.reset = this.reset.bind(this);

    this.getSnapshot = this.getSnapshot.bind(this);
  }

  public setOptions(options: AbstractControlOptions) {
    const { validators, mode } = options;

    if (validators) {
      this.setValidators(validators);
    }

    if (mode) {
      this.setValidationMode(mode);
    }

    if (Boolean(options.isDisabled) !== this._isDisabled) {
      this.setDisabled(!!options.isDisabled);
    }

    this._options = options;
  }

  public abstract setValue(value: TValue): void;

  public abstract reset(): void;

  public setTouched(value: boolean): void {
    this._isTouched = value;

    this.emitter.emit({ type: 'touched', payload: true });
  }

  public markAllAsTouched() {
    this.setTouched(true);
  }

  public setDirty(value: boolean): void {
    this._isDirty = value;

    this.emitter.emit({ type: 'dirty', payload: value });
  }

  public markAllAsDirty() {
    this.setDirty(true);
  }

  protected setFocused(value: boolean): void {
    this._isFocused = value;
  }

  public disable(): void {
    this.setDisabled(true);

    this.emitter.emit({ type: 'disabled' });
  }

  public enable(): void {
    this.setDisabled(false);

    this.emitter.emit({ type: 'enabled' });
  }

  public setDisabled(value: boolean): void {
    this._isDisabled = value;

    this.emitter.emit({ type: 'DisabledChanged', payload: value });
  }

  // Validation

  public addError(validationError: ValidationError) {
    this._validationErrors.push(validationError);
    this.emitter.emit({ type: 'errors-updated', payload: this._validationErrors });
  }

  public hasError(errorCode: string) {
    const found = this._validationErrors.find((error) => error.code === errorCode);

    return Boolean(found);
  }

  public clearErrors() {
    this._validationErrors = [];
    this.emitter.emit({ type: 'errors-updated', payload: [] });
  }

  public setErrors(validationErrors: ValidationError[]) {
    this._validationErrors = [...validationErrors];
    this.emitter.emit({ type: 'errors-updated', payload: this._validationErrors });
  }

  protected setValidating(value: boolean): void {
    this._isValidating = value;
  }

  public async validate(): Promise<ValidationResult> {
    this.setValidating(true);
    this.emitter.emit({ type: 'validation-started' });


    if (this.getValidationMode() === 'none' || this.validators.length === 0) {
      const result = { success: true, errors: [] };

      this.setValidating(false);
      this.emitter.emit({ type: 'validation-finished', payload: result });

      return result;
    }

    try {
      const result = await this.validateValue(this.value);

      if (result.success) {
        this.clearErrors();
      } else {
        this.setErrors(result.errors);
      }

      this.setValidating(false);
      this.emitter.emit({ type: 'validation-finished', payload: result });

      return result;
    } catch (error) {
      console.error('Unexpected validation error');

      this.setValidating(false);
      this.emitter.emit({ type: 'validation-finished', payload: { success: false, errors: [{ code: 'ERROR', meta: error }] } });

      throw error;
    }
  }

  public setValidationMode(mode: ValidationMode) {
    this._validationMode = mode;
  }

  // Validators

  public setValidators(validators: Validator | Validator[]) {
    if (Array.isArray(validators)) {
      this.validators = [...validators];
    } else {
      this.validators = [validators];
    }
  }

  public addValidators(validators: Validator | Validator[]) {
    if (Array.isArray(validators)) {
      this.validators.push(...validators);
    } else {
      this.validators.push(validators);
    }
  }

  public removeValidator(validator: Validator) {
    this.validators = this.validators.filter((v) => v !== validator);
  }

  public hasValidator(validator: Validator) {
    return this.validators.includes(validator);
  }

  public clearValidators() {
    this.validators = [];
  }

  protected async validateValue(data: unknown): Promise<ValidationResult> {
    const result = await Promise.all(
      this.validators.map((validator) => validateBySchema(data, validator)),
    );

    const success = result.every((res) => res.success);
    const errors = mergeArrays(result.map((res) => res.errors));

    return {
      success,
      errors,
    };
  }

  public getSnapshot() {
    return {
      value: this.value,

      isTouched: this.isTouched,
      isDirty: this.isDirty,
      isFocused: this.isFocused,

      isDisabled: this.isDisabled,
      isEnabled: this.isEnabled,

      isValid: this.isValid,
      isInvalid: this.isInvalid,
      errors: [...this.errors],
      isValidating: this.isValidating,
    };
  }

  // Parent

  public setParent(parent: AbstractControlGroup) {
    this._parent = parent;
  }

  public inheritConfiguration(parent: AbstractControlGroup) {
    if (!this._options.mode && parent.getValidationMode()) {
      this.setValidationMode(parent.getValidationMode()!);
    }
  }

}
