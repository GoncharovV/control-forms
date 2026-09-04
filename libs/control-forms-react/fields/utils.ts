import { AbstractControl } from '../../control-forms/abstract';


interface PropsWithControl {
  control: AbstractControl;
}

export function onlyIfControlUpdated(
  prev: PropsWithControl,
  next: PropsWithControl,
) {
  return prev.control.id === next.control.id;
}
