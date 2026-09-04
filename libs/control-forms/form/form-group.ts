import { AbstractControl, AbstractControlGroup, AbstractControlGroupOptions } from '../abstract';
import { Prettify } from '../events';
import { shallowEqualObjects } from '../utils';
import { ValidationIssue, ValidationResult } from '../validation';


const __DEV__ = process.env.NODE_ENV === 'development';


export type BaseFormFields = Record<string, AbstractControl>;

export interface FormGroupOptions<TFields extends Record<string, unknown> = any> extends AbstractControlGroupOptions {
  onValidSubmit?(data: Prettify<TFields>): Promise<void> | void;
  onInvalidSubmit?(validationResult: ValidationResult): Promise<void> | void;
  onAnySubmit?(data: Prettify<TFields> | null, validationResult: ValidationResult | null): Promise<void> | void;

  onUpdate?(data: Partial<TFields>): void;
}

export type FormGroupValues<TFields extends BaseFormFields> = Prettify<{
  [TKey in keyof TFields]: TFields[TKey] extends AbstractControl<infer TValue> ? TValue : never;
}>;


export class FormGroup<TFields extends BaseFormFields = any>
  extends AbstractControlGroup<FormGroupValues<TFields>> {

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

  public override get issues(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const [key, control] of Object.entries(this.fieldsConfig)) {
      issues.push(...control.issues.map((issue) => ({
        ...issue,
        path: [key, ...(issue.path ?? [])],
      })));
    }


    return issues;
  }

  constructor(
    private readonly fieldsConfig: TFields,
    private options: FormGroupOptions<FormGroupValues<TFields>> = {},
  ) {
    super(options);

    for (const control of Object.values(this.fieldsConfig)) {
      this.addChild(control);
    }

    this.setOptions(options);

    this.emitter.on('child-updated', ({ payload }) => {
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


  public setValue(values: FormGroupValues<TFields>): void {
    for (const [key, value] of Object.entries(values)) {
      this.fields[key].setValue(value);
    }

    this.options.onUpdate?.(this.value);
  }

  public async submit() {
    const validationResult = await this.validate();

    this.isSubmitting = true;
    this.isSubmitted = true;
    this.emitter.emit({ type: 'submit-started' });

    try {
      const submitPromises = validationResult.success
        ? [
          this.options.onValidSubmit?.(this.value),
          this.options.onAnySubmit?.(this.value, null),
        ]
        : [
          this.options.onInvalidSubmit?.(validationResult),
          this.options.onAnySubmit?.(null, validationResult),
        ];

      await Promise.all(submitPromises);
    } catch (exception: unknown) {
      if (__DEV__) {
        console.warn(
          'An unhandled exception was caught while submitting the form. %cFormGroup onSubmit callbacks should not throw%c.' +
          '\n\n' +
          'Make sure to process potential exceptions yourself',
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

  public async validate(): Promise<ValidationResult<FormGroupValues<TFields>>> {
    this.setValidating(true);

    const selfValidation = this.validators.validate(this.value);

    const fieldsValidationResultStore = {} as {
      [TKey in keyof TFields]: ValidationResult;
    };

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


    const success = ownResult.success && isChildrenValid;

    this.setValidating(false);

    if (success) {
      this.errors.clear();


      return {
        success: true,
        value: this.value, // TODO: may be save vales because of async
        issues: undefined,
      };
    }

    const issues: ValidationIssue[] = [];

    issues.push(...(ownResult.issues ?? []));

    for (const [key, result] of Object.entries(fieldsValidationResultStore)) {
      if (result.success === false) {
        const mapped = result.issues.map((issue) => {
          return {
            ...issue,
            path: [key, ...(issue.path ?? [])],
          };
        });

        issues.push(...mapped);
      }
    }

    return {
      success: false,
      issues,
    };
  }

  public reset() {
    this.isSubmitted = false;

    this.controls.forEach((control) => control.reset());

    this.options.onUpdate?.(this.value);
    this.emitter.emit({ type: 'reset' });
  }

}

export function isFormGroup(x: unknown): x is FormGroup {
  return x instanceof FormGroup;
}
