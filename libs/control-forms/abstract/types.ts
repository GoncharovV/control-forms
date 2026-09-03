
import { FormEvent } from '../events';
import { ValidationIssue, ValidationResult } from '../validation';
import { AbstractControl } from './abstract-control';


export type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit' | 'none';

// AbstractControl events

export type ControlResetEvent = FormEvent<'reset'>;
export type ControlDisabledEvent = FormEvent<'disabled'>;
export type ControlEnabledEvent = FormEvent<'enabled'>;
export type ControlDisabledChangedEvent = FormEvent<'disabled'>;
export type ControlDirtyChangedEvent = FormEvent<'dirty', boolean>;
export type ControlTouchedChangedEvent = FormEvent<'touched', boolean>;

// Validation events

export type ValidatingStateChangedEvent = FormEvent<'validating-state-changed', boolean>;


export type ValidationEndEvent = FormEvent<'validation-finished', ValidationResult>;
export type ValidationErrorsUpdatedEvent = FormEvent<'errors-updated', readonly ValidationIssue[]>;

export type ValidationEvent =
  | ValidatingStateChangedEvent
	| ValidationEndEvent
  | ValidationErrorsUpdatedEvent;


export type AbstractControlEvent =
    | ControlTouchedChangedEvent
    | ControlResetEvent
    | ControlDirtyChangedEvent
    | ControlDisabledEvent
    | ControlEnabledEvent
    | ControlDisabledChangedEvent
    | ValidationEvent
    | ({ type: (string & {}); });

export type ChildUpdatedEvent = FormEvent<'child-updated', {
  event: AbstractControlEvent;
  control: AbstractControl;
}>;

export type AbstractGroupEvent =
  | AbstractControlEvent
  | ChildUpdatedEvent;

export type ControlValue<TControl extends AbstractControl> = TControl extends AbstractControl<infer TValue> ? TValue : never;

export type ControlId = number;
