import { StandardSchemaV1 } from '@standard-schema/spec';

import { ValidationIssue, ValidationResult, Validator } from './types';


export function executeValidator<TValue = unknown>(
  validator: Validator<TValue>,
  value: TValue,
): ValidationResult<TValue> | Promise<ValidationResult<TValue>> {
  if (typeof validator === 'function') {
    return validator(value);
  }

  const result = validator['~standard'].validate(value);

  if (result instanceof Promise) {
    return result.then(mapStandardSchemaValidationResult);
  }

  return mapStandardSchemaValidationResult(result);
}


function mapStandardSchemaValidationResult<TValue = unknown>(result: StandardSchemaV1.Result<TValue>): ValidationResult<TValue> {
  if (typeof result.issues === 'undefined') {
    return { ...result, success: true, value: result.value };
  }

  return { ...result, success: false, issues: result.issues.map(mapValidationIssue) };
}

function mapValidationIssue(issue: StandardSchemaV1.Issue): ValidationIssue {
  return {
    code: 'error',
    ...issue,
  };
}

export function isNotPromise<T>(value: T | Promise<T>): value is T {
  return !(value instanceof Promise);
}

export function mergeValidationResults<TValue = unknown>(results: ValidationResult<TValue>[]): ValidationResult<TValue> {
  const isAllValidatorsSuccess = results.every((res) => res.success);

  if (isAllValidatorsSuccess) {
    const value = results[0].value;

    return { success: true, value, issues: undefined };
  }

  const issues: ValidationIssue[] = [];

  for (const result of results) {
    if (result.success === false) {
      issues.push(...result.issues);
    }
  }

  return { success: false, issues };
}
