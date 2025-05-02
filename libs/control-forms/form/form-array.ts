
import {
  AbstractControl,
  AbstractControlGroup,
  AbstractControlGroupOptions,
  ControlValue,
} from '../abstract';
import { FormArrayControlsValidation, FormArrayEvents, FormArrayValidationResult } from './types';


export type FormArrayOptions = AbstractControlGroupOptions;

export class FormArray<TControl extends AbstractControl = AbstractControl>
  extends AbstractControlGroup<ControlValue<TControl>[], FormArrayEvents> {

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

  public reset(): void {
    this.controls = [];

    this.emitter.emit({ type: 'reset' });
    this.emitter.emit({ type: 'controls-list-updated', payload: [] });
  }

  public addControl(control: TControl) {
    this.addChild(control);

    this.controls.push(control);

    this.emitter.emit({ type: 'control-added', payload: control });
    this.emitter.emit({ type: 'controls-list-updated', payload: this.controls });
  }


  public removeControl(control: AbstractControl) {
    const index = this.controls.findIndex((c) => c === control);

    if (index !== -1) {
      this.controls.splice(index, 1);

      this.emitter.emit({ type: 'control-removed', payload: control });
      this.emitter.emit({ type: 'controls-list-updated', payload: this.controls });
    }
  }

  public removeAt(index: number) {
    // TODO: Validate index in __DEV__

    const [control] = this.controls.splice(index, 1);

    if (control) {
      this.emitter.emit({ type: 'control-removed', payload: control });
      this.emitter.emit({ type: 'controls-list-updated', payload: this.controls });
    }
  }

  constructor(controls: TControl[] = [], options: FormArrayOptions = {}) {
    super(options);
    this.controls = controls;

    this.setChildren();
  }

  public async validate(): Promise<FormArrayValidationResult<TControl>> {
    this.setValidating(true);
    this.emitter.emit({ type: 'validation-started' });

    const selfValidationPromise = this.validateValue(this.value);

    const controlsValidationStore = new Array(this.size) as FormArrayControlsValidation<TControl>;

    let isAllControlValid = true;

    const controlValidationPromises = this.controls.map(async (control, index) => {
      const result = await control.validate();

      if (result.success === false) {
        isAllControlValid = false;
      }

      controlsValidationStore[index] = result as FormArrayControlsValidation<TControl>[number];
    });


    const [ownResult] = await Promise.all([selfValidationPromise, ...controlValidationPromises]);

    if (ownResult.success) {
      this.clearErrors();
    } else {
      this.setErrors(ownResult.errors);
    }

    this.setValidating(false);

    const success = ownResult.success && isAllControlValid;

    const result: FormArrayValidationResult<TControl> = {
      success,
      errors: ownResult.errors,
      controlsErrors: controlsValidationStore,
    };

    this.emitter.emit({ type: 'validation-finished', payload: result });

    return result;
  }

  public getSnapshot() {
    return {
      ...super.getSnapshot(),
      // TODO: move from snapshot cause its not serializable
      controls: [...this.controls],
    };
  }

}

export function isFormArray(x: unknown): x is FormArray {
  return x instanceof FormArray;
}
