import { AbstractControl, AbstractControlGroup, AbstractControlOptions } from '../abstract';
import { hasValidators } from '../validation';
import { EmptyCallback, FormControlEvent } from './types';


export interface FormControlOptions<TValue = any> extends AbstractControlOptions {
  onUpdate?(value: TValue): void;
  onFocus?: EmptyCallback;
  onBlur?: EmptyCallback;

  clearErrorsOnChange?: boolean;
}

// Type of 'update' event requires generic and cannot be part of FormControlEvent union (due to TS issue, idk)

export class FormControl<TValue = any> extends AbstractControl<TValue, FormControlEvent | { type: 'updated'; payload: TValue; }> {

  private _value: TValue;

  private element: HTMLElement | null = null;

  public get value() {
    return this._value;
  }

  /**
   * Reference to HTML-node associated with FormControl
   * 
   * Be careful. Affecting it may lead to unexpected behavior
   */
  public __unsafeElement() {
    return this.element;
  }

  private clearErrorsOnChange = true;

  protected get children() {
    return [];
  }

  constructor(
    private readonly initialValue: TValue,
    private options: FormControlOptions<TValue> = {},
  ) {
    super(options);

    this._value = initialValue;

    this.bindMethods();
  }

  private bindMethods() {
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);

    this.setElement = this.setElement.bind(this);
    this.focus = this.focus.bind(this);
  }

  public setOptions(options: FormControlOptions<TValue>) {
    super.setOptions(options);

    const { validators, mode, clearErrorsOnChange } = options;

    if (hasValidators(validators) && mode === undefined) {
      // Default validation mode for controls with provided validators
      this.setValidationMode('onSubmit');
    }

    if (clearErrorsOnChange !== undefined) {
      this.clearErrorsOnChange = clearErrorsOnChange;
    }

    this.options = options;
  }

  public setParent(parent: AbstractControlGroup): void {
    super.setParent(parent);
  }

  public setValue(value: TValue): void {
    const isValueChanged = this._value !== value;

    this._value = value;

    if (isValueChanged) {
      this.emitter.emit({ type: 'updated', payload: value });

      this.options.onUpdate?.(value);
    }

    if (this.clearErrorsOnChange) {
      this.clearErrors();
    }
  }

  public reset(): void {
    this.setDirty(false);
    this.setTouched(false);
    this.clearErrors();

    this.setValue(this.initialValue);

    this.emitter.emit({ type: 'reset' });
  }

  public focus() {
    this.element?.focus();
  }

  public onFocus() {
    this.setFocused(true);
    this.markAllAsTouched();

    this.emitter.emit({ type: 'focused' });

    this.options.onFocus?.();
  }

  public onChange(newValue: TValue) {
    this.setValue(newValue);

    this.markAllAsDirty();
    this.markAllAsTouched();

    if (this.getValidationMode() === 'onChange') {
      this.validate();
    }
  }

  public onBlur() {
    this.setFocused(false);

    this.emitter.emit({ type: 'blur' });

    this.options.onBlur?.();

    if (this.getValidationMode() === 'onBlur') {
      this.validate();
    }
  }

  public setElement(element: HTMLElement | null) {
    this.element = element;
  }

}

export function isFormControl(x: unknown): x is FormControl {
  return x instanceof FormControl;
}
