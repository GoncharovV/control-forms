import { AbstractControl, AbstractControlEvent } from '../abstract';
import { FormEvent } from '../events';
import { ValidationResult } from '../validation';


/**
 * TS is not ready for this
 */
// export type FormControlUpdateEvent<TValue = any> = FormEvent<'update', TValue>;

export type FormChildUpdateEvent = FormEvent<'child-event', {
  event: AbstractControlEvent;
  child: AbstractControl;
}>;

// FormControl events

export type FormControlFocusEvent = FormEvent<'focused'>;
export type FormControlBlurEvent = FormEvent<'blur'>;
export type FormControlEvent =
	// | FormControlUpdateEvent<TValue>
	| FormControlFocusEvent
	| FormControlBlurEvent
	| AbstractControlEvent;

// FormGroup events

export type FormGroupSubmitStartedEvent = FormEvent<'submit-started'>;
export type FormGroupSubmitFinishedEvent = FormEvent<'submit-finished'>;

export type FormGroupEvent =
	// | FormControlUpdateEvent<TValue>
	| FormGroupSubmitStartedEvent
	| FormGroupSubmitFinishedEvent
	| AbstractControlEvent;


export type ControlAddEvent = FormEvent<'control-added', AbstractControl>;
export type ControlRemoveEvent = FormEvent<'control-removed', AbstractControl>;
export type UpdateControlsListEvent = FormEvent<'controls-list-updated', AbstractControl[]>;


export type FormArrayEvents = AbstractControlEvent | ControlAddEvent | ControlRemoveEvent | UpdateControlsListEvent;


// Validation types

export type BaseFormFields = Record<string, AbstractControl>;

export type FormGroupFieldsValidation<TFields extends BaseFormFields> =
{
  [FieldName in keyof TFields]: Awaited<ReturnType<TFields[FieldName]['validate']>>
};


export interface FormGroupValidationResult<TFields extends BaseFormFields> extends ValidationResult {
  fieldErrors: FormGroupFieldsValidation<TFields>;
}

export type FormArrayControlsValidation<TControl extends AbstractControl> = Array<Awaited<ReturnType<TControl['validate']>>>;

export interface FormArrayValidationResult<TControl extends AbstractControl> extends ValidationResult {
  controlsErrors: FormArrayControlsValidation<TControl>;
}


export type EmptyCallback = () => void;


/**
 * The native SubmitEvent is incompatible with React event system
 * but we only need information about a few methods, so pick only them
 */
export type HTMLFormSubmitEvent = Pick<SubmitEvent, 'stopPropagation' | 'preventDefault'>;
