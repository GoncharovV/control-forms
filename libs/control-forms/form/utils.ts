import { AbstractControl, AbstractControlGroup } from '../abstract';
import { ValidationIssue } from '../validation';
import { FormArray } from './form-array';
import { FormGroup } from './form-group';


export function resolveNestedControlByPath(group: AbstractControlGroup, inputPath: ValidationIssue['path'] = []): AbstractControl | null {
  let current: AbstractControl = group;
  const path = [...inputPath];

  while (path.length) {
    const key = path.shift();

    if (typeof key === 'number') {
      if (current instanceof FormArray) {
        current = current.controls[key];
      } else {
        return null;
      }
    } else if (typeof key === 'string') {
      if (current instanceof FormGroup) {
        current = current.fields[key];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  return current;
}
