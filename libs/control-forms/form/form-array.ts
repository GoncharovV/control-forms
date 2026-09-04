
import {
  AbstractControl,
  AbstractControlGroup,
  AbstractControlGroupOptions,
  ControlValue,
} from '../abstract';
import { EventEmitter } from '../events';
import { ValidationIssue, ValidationResult } from '../validation';
import { FormArrayEvents } from './types';


export type FormArrayOptions = AbstractControlGroupOptions;

export class FormArray<TControl extends AbstractControl = AbstractControl>
  extends AbstractControlGroup<ControlValue<TControl>[]> {

  protected override readonly emitter = new EventEmitter<FormArrayEvents>();

  public controls: TControl[] = [];

  protected get children(): AbstractControl<ControlValue<TControl>>[] {
    return this.controls;
  }

  public get size() {
    return this.controls.length;
  }

  public get value(): ControlValue<TControl>[] {
    return this.controls.map((control) => control.value);
  }

  public setValue(value: ControlValue<TControl>[]): void {
    this.controls.forEach((control, inx) => control.setValue(value[inx]));
  }

  public override get issues(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const [index, control] of this.controls.entries()) {
      issues.push(...control.issues.map((issue) => ({
        ...issue,
        path: [index, ...(issue.path ?? [])],
      })));
    }


    return issues;
  }

  public reset(): void {
    this.controls = [];

    this.emitter.emit({ type: 'reset' });
    this.emitter.emit({ type: 'controls-changed', payload: [] });
  }

  public addControl(control: TControl) {
    this.addChild(control);

    this.controls.push(control);

    this.emitter.emit({ type: 'controls-changed', payload: this.controls });
  }

  public removeControl(control: AbstractControl) {
    const index = this.controls.findIndex((c) => c === control);

    if (index !== -1) {
      this.removeAt(index);
    }
  }

  public removeAt(index: number) {
    const [control] = this.controls.splice(index, 1);

    if (control) {
      this.removeChild(control);
      this.emitter.emit({ type: 'controls-changed', payload: this.controls });
    }
  }

  constructor(controls: TControl[] = [], options: FormArrayOptions = {}) {
    super(options);
    this.controls = controls;

    for (const control of controls) {
      this.addChild(control);
    }
  }

  public async validate(): Promise<ValidationResult<TControl extends AbstractControl<infer TValue> ? TValue[] : unknown[]>> {
    this.setValidating(true);
    this.emitter.emit({ type: 'validation-started' });

    const selfValidationPromise = this.validators.validate(this.value);

    const controlsValidationStore = new Array<ValidationResult>(this.size);

    let isAllControlValid = true;

    const controlValidationPromises = this.controls.map(async (control, index) => {
      const result = await control.validate();

      if (result.success === false) {
        isAllControlValid = false;
      }

      controlsValidationStore[index] = result;
    });


    const [ownResult] = await Promise.all([selfValidationPromise, ...controlValidationPromises]);

    this.setValidating(false);

    const success = ownResult.success && isAllControlValid;

    if (success) {
      this.errors.clear();

      return {
        success: true,
        value: this.value as any, // TODO: may be save vales because of async
        issues: undefined,
      };
    }

    const issues: ValidationIssue[] = [];

    issues.push(...(ownResult.issues ?? []));

    for (const [index, result] of controlsValidationStore.entries()) {
      if (result.success === false) {
        const mapped = result.issues.map((issue) => {
          return {
            ...issue,
            path: [index, ...(issue.path ?? [])],
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

}

export function isFormArray(x: unknown): x is FormArray {
  return x instanceof FormArray;
}
