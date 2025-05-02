import { Validator } from '.';


export function hasValidators(validators: undefined | null | Validator | Validator[]) {
  if (!validators) {
    return false;
  }

  if (Array.isArray(validators)) {
    return validators.length > 0;
  }

  return true;
}
