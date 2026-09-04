import { AbstractControl, AbstractControlEvent } from '../abstract';
import { FormEvent } from '../events';


export type FormChildUpdateEvent = FormEvent<'child-event', {
  event: AbstractControlEvent;
  child: AbstractControl;
}>;

// FormControl events

export type FormControlUpdatedEvent<TValue = any> = FormEvent<'updated', TValue>;
export type FormControlFocusEvent = FormEvent<'focused'>;
export type FormControlBlurEvent = FormEvent<'blur'>;

export type FormControlEvent<TValue = any> =
	| AbstractControlEvent
	| FormControlUpdatedEvent<TValue>
	| FormControlFocusEvent
	| FormControlBlurEvent;

// FormGroup events

export type FormGroupSubmitStartedEvent = FormEvent<'submit-started'>;
export type FormGroupSubmitFinishedEvent = FormEvent<'submit-finished'>;

export type FormGroupEvent =
	// | FormControlUpdateEvent<TValue>
	| FormGroupSubmitStartedEvent
	| FormGroupSubmitFinishedEvent
	| AbstractControlEvent;


export type UpdateControlsListEvent = FormEvent<'controls-changed', AbstractControl[]>;


export type FormArrayEvents = AbstractControlEvent | UpdateControlsListEvent;


// Validation types

export type BaseFormFields = Record<string, AbstractControl>;


export type EmptyCallback = () => void;
