import { FormEvent } from '../events';
import { AbstractControl, AbstractControlOptions } from './abstract-control';
import { AbstractGroupEvent } from './types';


export type AbstractControlGroupOptions = AbstractControlOptions;

export abstract class AbstractControlGroup<
  TValue = any,
  TEvents extends FormEvent = any,
> extends AbstractControl<TValue, TEvents | AbstractGroupEvent> {

  public get isValidating() {
    return this.children.some((control) => control.isValidating);
  }

  public get isFocused(): boolean {
    return this.children.some((control) => control.isFocused);
  }

  public get isTouched(): boolean {
    return this.children.some((control) => control.isTouched);
  }

  public get isDisabled(): boolean {
    return this.children.every((control) => control.isDisabled);
  }

  public get isDirty(): boolean {
    return this.children.some((control) => control.isDirty);
  }

  public get isValid() {
    const isValid = this.errors.length === 0;
    const isAllChildrenValid = this.children.every((control) => control.isValid);

    return isValid && isAllChildrenValid;
  }

  constructor(options: AbstractControlGroupOptions = {}) {
    super(options);
  }

  protected setChildren() {
    for (const control of this.children) {
      this.addChild(control);
    }
  }

  protected addChild(control: AbstractControl) {
    control.setParent(this);

    control.inheritConfiguration(this);

    control.events.subscribe((event) => {
      this.emitter.emit({ type: 'child-event', payload: { event, control: control } });
    });
  }

  public disable() {
    this.children.forEach((control) => control.disable());
  }

  public enable() {
    this.children.forEach((control) => control.enable());
  }

  public setDirty(value: boolean): void {
    this.children.forEach((control) => control.setDirty(value));
  }

  public setTouched(value: boolean): void {
    this.children.forEach((control) => control.setTouched(value));
  }

}
