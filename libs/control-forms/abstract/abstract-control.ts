import { EventEmitter, FormEvent, ReadonlyEventEmitter } from '../events';
import { id } from '../utils';
import { ErrorsStorage, ValidationResult, Validator, ValidatorsController } from '../validation';
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
	 * ```
	 * new FormControl('', { validators: [z.string().min(5).max(10)] })
	 * ```
	 * 
	 * And even async validators are supported:
	 * 
	 * @example
	 * ```ts
	 * const emailControl = new FormControl('', { validators: [
	 *     z.string().refine(() => { return api.checkExistence() })
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

  /**
   * All calls of `validate` will be skipped if this function returns `true`
   */
  skipValidationIf?: () => boolean;
}

export abstract class AbstractControl<
  TValue = any,
  TEvents extends FormEvent = any,
> {

  public readonly id: ControlId;

  public abstract get value(): TValue;

  private _isValidating = false;

  private _parent: AbstractControlGroup | null = null;

  protected readonly emitter = new EventEmitter<AbstractControlEvent | TEvents>();

  public get events(): ReadonlyEventEmitter<AbstractControlEvent | TEvents> {
    return this.emitter;
  }

  protected get children(): AbstractControl<any>[] {
    return [];
  }

  // #region Dirty

  private _isDirty = false;

  /**
     * Shows value was changed by user
     */
  public get isDirty() {
    return this._isDirty;
  }

  public setDirty(value: boolean): void {
    this._isDirty = value;

    this.emitter.emit({ type: 'dirty', payload: value });
  }

  public markAllAsDirty() {
    this.setDirty(true);
  }

  // #endregion

  // #region Touched

  private _isTouched = false;

  /**
     * Shows form control was focused
     */
  public get isTouched() {
    return this._isTouched;
  }

  public setTouched(value: boolean): void {
    this._isTouched = value;

    this.emitter.emit({ type: 'touched', payload: true });
  }

  public markAllAsTouched() {
    this.setTouched(true);
  }

  // #endregion

  // #region Focused

  private _isFocused = false;

  public get isFocused() {
    return this._isFocused;
  }

  protected setFocused(value: boolean): void {
    this._isFocused = value;
  }

  // #endregion

  public get isValidating() {
    return this._isValidating;
  }

  // #region Enabled/Disabled

  private _isDisabled = false;

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

  // #endregion

  public get parent() {
    return this._parent;
  }

  /**
  * If `true` – control has no validation errors
  */
  public get isValid() {
    return this.errors.count() === 0;
  }

  /**
  * If `true` – control has validation errors
  */
  public get isInvalid() {
    return !this.isValid;
  }

  // #region Validation Mode

  private _validationMode: ValidationMode | null = null;

  public get validationMode() {
    return this._validationMode;
  }

  public setValidationMode(mode: ValidationMode) {
    this._validationMode = mode;
  }

  // #endregion


  public readonly validators: ValidatorsController<unknown>;

  public readonly errors: ErrorsStorage;

  constructor(private _options: AbstractControlOptions = {}) {
    this.setOptions(_options);

    this.id = _options.id || id();

    this.validators = new ValidatorsController();

    this.errors = new ErrorsStorage({
      onUpdate: (errors) => this.emitter.emit({ type: 'errors-updated', payload: errors }),
    });
  }

  public abstract setValue(value: TValue): void;

  public abstract reset(): void;


  public setOptions(options: AbstractControlOptions) {
    const { validators, mode } = options;

    if (validators) {
      this.validators.replace(validators);
    }

    if (mode) {
      this.setValidationMode(mode);
    }

    if (Boolean(options.isDisabled) !== this._isDisabled) {
      this.setDisabled(!!options.isDisabled);
    }

    this._options = options;
  }


  // Validation


  protected setValidating(value: boolean): void {
    this._isValidating = value;

    this.emitter.emit({ type: 'validating-state-changed', payload: value });
  }

  public async validate(): Promise<ValidationResult> {
    if (this.getShouldValidate() === false) {
      return { success: true, value: this.value };
    }

    this.setValidating(true);

    const result = await this.validators.validate(this.value);

    if (result.success === true) {
      this.errors.clear();
    } else {
      this.errors.replace(result.issues);
    }

    this.setValidating(false);

    return result;
  }

  private getShouldValidate() {
    if (this.validationMode === 'none' || this.validationMode === null) {
      return false;
    }

    if (typeof this._options.skipValidationIf !== 'undefined') {
      return !this._options.skipValidationIf();
    }

    return true;
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
      errors: [...this.errors.getAll()],
      isValidating: this.isValidating,
    };
  }

  // Parent

  public setParent(parent: AbstractControlGroup) {
    this._parent = parent;
  }

  public inheritConfiguration(parent: AbstractControlGroup) {
    if (this.validationMode === null && parent.validationMode !== null) {
      this.setValidationMode(parent.validationMode);
    }
  }

}
