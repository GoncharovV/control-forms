import { StandardSchemaV1 } from '@standard-schema/spec';

// Results. Must satisfy StandardSchemaV1.Result type.

export interface SuccessValidationResult<TValue = unknown> extends StandardSchemaV1.SuccessResult<TValue> {
  readonly success: true;
}

export interface FailureValidationResult extends StandardSchemaV1.FailureResult {
  readonly success: false;
  readonly issues: ReadonlyArray<ValidationIssue>;
}

export interface ValidationIssue extends StandardSchemaV1.Issue {
  readonly code: string;
}

export type ValidationResult<TValue = unknown> = SuccessValidationResult<TValue> | FailureValidationResult;

// Validators

export type ValidatorFunction<TValue = unknown> = (value: TValue) => ValidationResult<TValue> | Promise<ValidationResult<TValue>>;

export type Validator<TValue = unknown> = ValidatorFunction<TValue> | StandardSchemaV1<TValue, TValue>;
