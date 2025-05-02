
import { FormEvent } from '../events';
import { ValidationError, ValidationResult } from '../validation';
import { AbstractControl } from './abstract-control';


export type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit' | 'none';

// AbstractControl events

export type ControlResetEvent = FormEvent<'reset'>;
export type ControlDisabledEvent = FormEvent<'disabled'>;
export type ControlEnabledEvent = FormEvent<'enabled'>;
export type ControlDirtyChangedEvent = FormEvent<'dirty', boolean>;
export type ControlTouchedChangedEvent = FormEvent<'touched', boolean>;
export type ControlDisabledChangedEvent = FormEvent<'DisabledChanged', boolean>;

// Validation events

export type ValidationStartEvent = FormEvent<'validation-started'>;
export type ValidationEndEvent = FormEvent<'validation-finished', ValidationResult>;
export type ValidationErrorsUpdatedEvent = FormEvent<'errors-updated', ValidationError[]>;

export type ValidationEvent =
	| ValidationStartEvent
	| ValidationEndEvent
  | ValidationErrorsUpdatedEvent;


export type AbstractControlEvent =
    | ControlTouchedChangedEvent
    | ControlResetEvent
    | ControlDirtyChangedEvent
    | ControlDisabledEvent
    | ControlEnabledEvent
    | ControlDisabledChangedEvent
    | ValidationEvent;

export type ChildUpdateEvent = FormEvent<'child-event', {
  event: AbstractControlEvent;
  control: AbstractControl;
}>;

export type AbstractGroupEvent =
  | AbstractControlEvent
  | ChildUpdateEvent;

export type ControlValue<TControl extends AbstractControl> = TControl extends AbstractControl<infer TValue> ? TValue : never;

export type ControlId = number;
