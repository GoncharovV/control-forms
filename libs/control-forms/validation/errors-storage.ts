import { ValidationIssue } from './types';


export interface ErrorsStorageOptions {
  onUpdate?: (errors: readonly ValidationIssue[]) => void;
}

export class ErrorsStorage {

  private _errors: ValidationIssue[] = [];

  constructor(private readonly options: ErrorsStorageOptions = {}) {

  }

  public replace(errors: readonly ValidationIssue[]) {
    this._errors = [...errors];

    this.options.onUpdate?.(this._errors);
  }

  public add(error: ValidationIssue) {
    this.replace([...this._errors, error]);
  }

  public has(errorCode: string) {
    const found = this._errors.find((error) => error.code === errorCode);

    return Boolean(found);
  }

  public clear() {
    this.replace([]);
  }

  public remove(errorCode: string) {
    this.replace(
      this._errors.filter((error) => error.code !== errorCode),
    );
  }

  public getAll() {
    return this._errors;
  }

  public getFirst(): ValidationIssue | null {
    return this._errors[0] || null;
  }

  public count() {
    return this._errors.length;
  }


}
