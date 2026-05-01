
import { FailureValidationResult, SuccessValidationResult, ValidatorFunction } from '../validation';


export const enum ErrorCodes {
  REQUIRED = 'required',
  TYPE_ERROR = 'type_error',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length',
}

function createSuccessResult(value: unknown): SuccessValidationResult {
  return { success: true, value };
}

function createFailureResult(code: ErrorCodes): FailureValidationResult {
  return { success: false, issues: [{ code, message: code }] };
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

    if (isError === false) {
      return createSuccessResult(data);
    }

    return createFailureResult(ErrorCodes.REQUIRED);
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
      return createFailureResult(ErrorCodes.TYPE_ERROR);
    }

    if (data.length >= min) {
      return createSuccessResult(data);
    }

    return createFailureResult(ErrorCodes.MIN_LENGTH);
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
      return createFailureResult(ErrorCodes.TYPE_ERROR);
    }

    if (data.length <= max) {
      return createSuccessResult(data);
    }

    return createFailureResult(ErrorCodes.MAX_LENGTH);
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
