import { AbstractControl, AbstractControlGroup, AbstractControlGroupOptions } from '../abstract';
import { Prettify } from '../events';
import { copyObject, shallowEqualObjects } from '../utils';
import { ValidationResult } from '../validation';
import {
  FormGroupEvent,
  FormGroupFieldsValidation,
  FormGroupValidationResult,
  HTMLFormSubmitEvent,
} from './types';


const __DEV__ = process.env.NODE_ENV === 'development';


export type BaseFormFields = Record<string, AbstractControl>;

export interface FormGroupOptions<TFields extends Record<string, unknown> = any> extends AbstractControlGroupOptions {
  onValidSubmit?(data: Prettify<TFields>): Promise<void> | void;
  onInvalidSubmit?(validationResult: ValidationResult): Promise<void> | void;
  onAnySubmit?(): Promise<void> | void;

  onUpdate?(data: Partial<TFields>): void;
}

export type FormGroupValues<TFields extends BaseFormFields> = Prettify<{
  [TKey in keyof TFields]: TFields[TKey] extends AbstractControl<infer TValue> ? TValue : never;
}>;

// Type of 'update' event requires generic and cannot be part of FormControlEvent union (due to TS issue, idk)

export class FormGroup<TFields extends BaseFormFields = any>
  extends AbstractControlGroup<FormGroupValues<TFields>, FormGroupEvent | { type: 'updated'; payload: FormGroupValues<TFields>; }> {

  public isSubmitted = false;

  public isSubmitting = false;

  protected get children(): AbstractControl[] {
    return this.controls;
  }

  public get fields(): TFields {
    return this.fieldsConfig;
  }

  private get controls() {
    return Object.values<AbstractControl>(this.fieldsConfig);
  }

  public get isLoading() {
    return this.isSubmitting || this.isValidating;
  }

  public get value(): FormGroupValues<TFields> {
    const result: Record<string, any> = {};

    for (const [key, control] of Object.entries(this.fieldsConfig)) {
      result[key] = control.value;
    }

    return result as FormGroupValues<TFields>;
  }

  private _lastValidationResult: FormGroupValidationResult<TFields> | null = null;

  public get lastValidationResult() {
    return this._lastValidationResult;
  }

  constructor(
    private readonly fieldsConfig: TFields,
    private options: FormGroupOptions<FormGroupValues<TFields>> = {},
  ) {
    super(options);

    this.setChildren();

    this.bindMethods();

    this.setOptions(options);

    this.emitter.on('child-event', ({ payload }) => {
      if ((payload.event.type as 'updated') === 'updated') {
        this.options.onUpdate?.(this.value);
      }
    });
  }

  public setOptions(options: FormGroupOptions<FormGroupValues<TFields>>) {
    if (!!this.options && shallowEqualObjects(this.options, options)) {
      return;
    }

    super.setOptions(options);

    this.options = options;
  }

  private bindMethods() {
    this.submit = this.submit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  public setValue(values: FormGroupValues<TFields>): void {
    const oldValue = copyObject(this.value);

    for (const [key, value] of Object.entries(values)) {
      this.fields[key].setValue(value);
    }

    const isValueChanged = !shallowEqualObjects(oldValue, this.value);

    if (isValueChanged) {
      this.options.onUpdate?.(this.value);
    }
  }

  public async submit() {
    const validationResult = await this.validate();

    this.isSubmitting = true;
    this.isSubmitted = true;
    this.emitter.emit({ type: 'submit-started' });

    try {
      await Promise.all([
        validationResult.success
          ? this.options.onValidSubmit?.(this.value)
          : this.options.onInvalidSubmit?.(validationResult),

        this.options.onAnySubmit?.(),
      ]);
    } catch (exception: unknown) {
      if (__DEV__) {
        console.warn(
          'An unhandled exception was caught while submitting the form. %cFormGroup onSubmit callbacks should not throw%c.' +
          '\n\n' +
          'Make sure to process potential exception yourself',
          'font-weight: bold',
          'font-weight: normal',
        );
      }

      console.error(exception);
    } finally {
      this.isSubmitting = false;
      this.emitter.emit({ type: 'submit-finished' });
    }
  }

  public async validate(): Promise<FormGroupValidationResult<TFields>> {
    this.setValidating(true);
    this.emitter.emit({ type: 'validation-started' });

    const selfValidation = this.validateValue(this.value);

    const fieldsValidationResultStore = {} as FormGroupFieldsValidation<TFields>;

    let isChildrenValid = true;

    const childPromises = Object.entries(this.fieldsConfig).map(async ([key, control]) => {
      const result = await control.validate();

      if (result.success === false) {
        isChildrenValid = false;
      }

      // @ts-expect-error TS does not allow to modify generic objects :/
      fieldsValidationResultStore[key] = result;
    });


    const [ownResult] = await Promise.all([selfValidation, ...childPromises]);

    if (ownResult.success) {
      this.clearErrors();
    } else {
      this.setErrors(ownResult.errors);
    }

    this.setValidating(false);

    const success = ownResult.success && isChildrenValid;

    const result: FormGroupValidationResult<TFields> = {
      success,
      errors: ownResult.errors,
      fieldErrors: fieldsValidationResultStore,
    };

    this._lastValidationResult = result;

    this.emitter.emit({ type: 'validation-finished', payload: result });

    return result;
  }

  public async onSubmit(event: HTMLFormSubmitEvent) {
    event.preventDefault();
    event.stopPropagation();

    await this.submit();
  }

  public reset() {
    this.isSubmitted = false;

    const oldValue = copyObject(this.value);

    this.controls.forEach((control) => control.reset());

    const isValueChanged = !shallowEqualObjects(oldValue, this.value);

    if (isValueChanged) {
      this.options.onUpdate?.(this.value);
    }

    this.emitter.emit({ type: 'reset' });
  }

  public getSnapshot() {
    return {
      ...super.getSnapshot(),
      isLoading: this.isLoading,
      isSubmitted: this.isSubmitted,
      fields: this.fields,
      isSubmitting: this.isSubmitting,
      lastValidationResult: this.lastValidationResult,
    };
  }

}

export function isFormGroup(x: unknown): x is FormGroup {
  return x instanceof FormGroup;
}
