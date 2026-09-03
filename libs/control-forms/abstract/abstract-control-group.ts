
import { EventEmitter, UnsubscribeFn } from '../events';
import { AbstractControl, AbstractControlOptions } from './abstract-control';
import { AbstractGroupEvent } from './types';


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AbstractControlGroupOptions extends AbstractControlOptions {

}

export abstract class AbstractControlGroup<
  TValue = any,
> extends AbstractControl<TValue> {

  protected override readonly emitter = new EventEmitter<AbstractGroupEvent>();

  public override get isValidating() {
    return this.children.some((control) => control.isValidating);
  }

  public override get isFocused(): boolean {
    return this.children.some((control) => control.isFocused);
  }

  public override get isTouched(): boolean {
    return this.children.some((control) => control.isTouched);
  }

  public override get isDisabled(): boolean {
    return this.children.every((control) => control.isDisabled);
  }

  public override get isDirty(): boolean {
    return this.children.some((control) => control.isDirty);
  }

  public override get isValid() {
    const isValid = this.errors.count() === 0;
    const isAllChildrenValid = this.children.every((control) => control.isValid);

    return isValid && isAllChildrenValid;
  }

  private readonly childUpdatesSubscriptionsMap = new Map<AbstractControl, UnsubscribeFn>();

  constructor(options: AbstractControlGroupOptions = {}) {
    super(options);
  }

  protected addChild(control: AbstractControl) {
    control.setParent(this);

    const unsubscribe = control.events.subscribe((event) => {
      this.emitter.emit({ type: 'child-updated', payload: { event, control: control } });
    });

    this.childUpdatesSubscriptionsMap.set(control, unsubscribe);
  }

  protected removeChild(control: AbstractControl) {
    if (control.parent !== this) {
      return;
    }

    control.setParent(null);

    const unsubscribe = this.childUpdatesSubscriptionsMap.get(control);

    unsubscribe?.();

    this.childUpdatesSubscriptionsMap.delete(control);
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

  public dispose() {
    for (const control of this.children) {
      this.removeChild(control);
    }

    this.childUpdatesSubscriptionsMap.forEach((unsubscribe) => unsubscribe());
    this.childUpdatesSubscriptionsMap.clear();
  }

}
