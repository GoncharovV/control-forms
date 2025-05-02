import { AbstractControl } from '../control-forms';


export type ControlOrFactory<TControl extends AbstractControl> = TControl | (() => TControl);
