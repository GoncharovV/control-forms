import { AbstractControl, AbstractControlGroup, AbstractControlOptions } from '../abstract';
import { EventEmitter, ReadonlyEventEmitter } from '../events';
import { EmptyCallback, FormControlEvent } from './types';


export interface FormControlOptions<TValue = any> extends AbstractControlOptions {
  onUpdate?(value: TValue): void;
  onFocus?: EmptyCallback;
  onBlur?: EmptyCallback;

  clearErrorsOnChange?: boolean;
}

export class FormControl<TValue = any> extends AbstractControl<TValue> {

  private _value: TValue;

  private element: HTMLElement | null = null;

  protected readonly emitter = new EventEmitter<FormControlEvent<TValue>>();

  public get events(): ReadonlyEventEmitter<FormControlEvent<TValue>> {
    return this.emitter;
  }

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

    this.setElement = this.setElement.bind(this);
    this.focus = this.focus.bind(this);
  }

  public setOptions(options: FormControlOptions<TValue>) {
    super.setOptions(options);

    const { clearErrorsOnChange } = options;

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
      // @ts-expect-error TODO:
      this.emitter.emit({ type: 'updated', payload: value });

      this.options.onUpdate?.(value);
    }

    if (this.clearErrorsOnChange) {
      this.errors.clear();
    }
  }

  public reset(): void {
    this.setDirty(false);
    this.setTouched(false);
    this.errors.clear();

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

    if (this.validationMode === 'onChange') {
      this.validate();
    }
  }

  public onBlur() {
    this.setFocused(false);

    this.emitter.emit({ type: 'blur' });

    this.options.onBlur?.();

    if (this.validationMode === 'onBlur') {
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
