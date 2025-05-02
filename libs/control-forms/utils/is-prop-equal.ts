import { shallowEqualObjects } from './shallow-equal-objects';


export function isPropEqual(a: any, b: any) {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'object') {
    return shallowEqualObjects(a, b);
  }

  return false;
}
