import { AbstractControl } from '../control-forms/abstract';
import { Prettify } from '../control-forms/events';


/**
 * Only non-function properties are included in the snapshot
 */
export type ControlSnapshot<TControl extends AbstractControl> = Prettify<{
  [TKey in keyof TControl as TControl[TKey] extends Function ? never : TKey]: TControl[TKey]
}>;

export function getControlSnapshot<TControl extends AbstractControl>(control: TControl): ControlSnapshot<TControl> {
  const properties = getAllProperties(control);

  const result = {} as ControlSnapshot<TControl>;

  for (const property of properties as (keyof TControl)[]) {
    if (typeof control[property] !== 'function') {
      // @ts-expect-error Ignore it
      result[property] = control[property];
    }
  }

  return result;
}

export type ControlApiSnapshot<TControl extends AbstractControl> = Prettify<{
  [TKey in keyof TControl as TControl[TKey] extends Function ? TKey : never]: TControl[TKey]
}>;

export function getControlApi<TControl extends AbstractControl>(control: TControl): ControlApiSnapshot<TControl> {
  const properties = getAllProperties(control);

  const result = {} as ControlApiSnapshot<TControl>;

  for (const property of properties as (keyof TControl)[]) {
    if (typeof control[property] === 'function') {
      // @ts-expect-error Ignore it
      result[property] = control[property].bind(control);
    }
  }

  return result;
}


function getAllProperties(instance: object): string[] {
  const properties = new Set<string>();

  let current = instance;

  while (current && current !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(current)) {
      if (!key.startsWith('_')) {
        properties.add(key);
      }
    }

    current = Object.getPrototypeOf(current);
  }

  properties.delete('constructor');
  properties.delete('options');
  properties.delete('children');
  properties.delete('initialValue');
  properties.delete('emitter');

  return Array.from(properties);
}
