
import { StandardSchemaV1 } from '@standard-schema/spec';

import { ValidationResult, Validator } from './types';
import { executeValidator, isNotPromise, mergeValidationResults } from './utils';


export class ValidatorsController<TValue = unknown> implements StandardSchemaV1.Props<TValue, TValue> {

  // #region Standard Schema V1

  public readonly version = 1;

  public readonly vendor = 'control-forms';

  // #endregion

  private _validators: Validator<TValue>[] = [];

  public get validators(): ReadonlyArray<Validator<TValue>> {
    return this._validators;
  }

  public replace(validators: Validator<TValue> | Validator<TValue>[]) {
    const newValidators = Array.isArray(validators) ? validators : [validators];

    this._validators = [...newValidators];
  }

  public add(validators: Validator<TValue> | Validator<TValue>[]) {
    const newValidators = Array.isArray(validators) ? validators : [validators];

    this.replace([...this._validators, ...newValidators]);
  }

  public remove(validator: Validator) {
    this.replace(
      this._validators.filter((v) => v !== validator),
    );
  }

  public has(validator: Validator) {
    return this._validators.includes(validator as Validator<TValue>);
  }

  public clear() {
    this.replace([]);
  }

  public validate(value: unknown): ValidationResult<TValue> | Promise<ValidationResult<TValue>> {
    // Consider any result as valid if no validators passed
    if (this._validators.length === 0) {
      return { success: true, value: value as TValue, issues: undefined };
    }

    const results = this.validators.map((validator) => executeValidator(validator, value as TValue));

    // All validators are sync -> return sync result
    if (results.every(isNotPromise)) {
      return mergeValidationResults(results);
    }

    // Handle async results
    const unsafePromise = Promise.all(results).then(mergeValidationResults);

    // Default error handler for better runtime safety
    return unsafePromise.catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected error. Validators must not throw.');

        throw error;
      }

      return { success: false, issues: [] };
    });
  }

}
