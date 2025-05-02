
import { ValidationResult } from './types';
import { zodAdapter, ZodValidationSchema } from './zod-validation-adapter';


export type ValidatorFunction = (value: unknown) => ValidationResult | Promise<ValidationResult>;

export type Validator = ValidatorFunction | ZodValidationSchema;

export async function validateBySchema(
  value: unknown,
  validator: Validator,
): Promise<ValidationResult> {
  if (typeof validator === 'object') {
    return zodAdapter(value, validator);
  }

  return validator(value);
}

export const enum ErrorCodes {
  REQUIRED = 'required',
  TYPE_ERROR = 'type_error',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length',
}

function createResult(success: boolean, code?: ErrorCodes): ValidationResult {
  return {
    success,
    errors: !success && code ? [{ code }] : [],
  };
}

/**
 * Required value validator
 * 
 * Checks for `""`, `null`, `undefined`, `NaN`
 * 
 * (!) _empty arrays_ and _empty objects_ – **will be considered valid**
 * 
 * Codes: `ErrorCodes.REQUIRED`
 */
function required(): ValidatorFunction {
  return (data: unknown) => {
    const isError = (typeof data === 'string' && data.length === 0) ||
			(typeof data === 'number' && isNaN(data)) ||
			data === undefined ||
			data === null;

    return createResult(!isError, ErrorCodes.REQUIRED);
  };
}

/**
 * Min Length validator. Works for strings and arrays
 * 
 * Codes: `ErrorCodes.MIN_LENGTH` or `ErrorCodes.TYPE_ERROR` for other value types
 */
function minLength(min: number): ValidatorFunction {
  return (data: unknown) => {
    if (typeof data !== 'string' && !Array.isArray(data)) {
      return createResult(false, ErrorCodes.TYPE_ERROR);
    }

    return createResult(data.length >= min, ErrorCodes.MIN_LENGTH);
  };
}

/**
 * Max Length validator. Works for strings and arrays
 * 
 * Codes: `ErrorCodes.MAX_LENGTH` or `ErrorCodes.TYPE_ERROR` for other value types
 */
function maxLength(max: number): ValidatorFunction {
  return (data: unknown) => {
    if (typeof data !== 'string' && !Array.isArray(data)) {
      return createResult(false, ErrorCodes.TYPE_ERROR);
    }

    return createResult(data.length <= max, ErrorCodes.MAX_LENGTH);
  };
}

/**
 * Set of simple build-in validators
 * 
 * For more complex validation we strongly recommend to use external libraries like `zod`
 */
export const Validators = {
  required,
  minLength,
  maxLength,
};
