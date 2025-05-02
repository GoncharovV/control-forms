import { FormControl, isFormControl } from '../libs/control-forms';


describe('FormControl', () => {
  describe('Value', () => {
    test('Check initial Value', () => {
      const control = new FormControl('initial');

      expect(control.value).toBe('initial');
    });

    test('Change value via setValue', () => {
      const control = new FormControl('initial');

      control.setValue('changed');

      expect(control.value).toEqual('changed');
    });

    test('Calls onUpdate callback when value changed via setValue', () => {
      const fn = vi.fn();

      const control = new FormControl('', { onUpdate: fn });

      control.setValue('changed');

      expect(fn).toHaveBeenCalledWith('changed');
    });

    test('Calls onUpdate callback repeatedly', () => {
      const fn = vi.fn();

      const control = new FormControl('', { onUpdate: fn });

      control.setValue('1');
      expect(fn).toHaveBeenCalledWith('1');

      control.setValue('2');
      expect(fn).toHaveBeenCalledWith('2');

      control.setValue('3');
      expect(fn).toHaveBeenCalledWith('3');

      expect(fn).toHaveBeenCalledTimes(3);
    });

    test('Change value via register().onChange(event)', () => {
      const control = new FormControl('initial');

      control.onChange('changed');

      expect(control.value).toEqual('changed');
    });

    test('Calls onUpdate callback when value changed via onChange(event)', () => {
      const fn = vi.fn();

      const control = new FormControl('', { onUpdate: fn });

      control.onChange('changed');

      expect(fn).toHaveBeenCalledWith('changed');
    });

    test('Calls onUpdate callback repeatedly via onChange(event)', () => {
      const fn = vi.fn();

      const control = new FormControl('', { onUpdate: fn });

      control.onChange('1');
      expect(fn).toHaveBeenCalledWith('1');

      control.onChange('2');
      expect(fn).toHaveBeenCalledWith('2');

      control.onChange('3');
      expect(fn).toHaveBeenCalledWith('3');

      expect(fn).toHaveBeenCalledTimes(3);
    });

    test('Calls onUpdate callbacks when receive update via onChange', () => {
      const onUpdateFn = vi.fn();

      const control = new FormControl('', { onUpdate: onUpdateFn });

      control.onChange('changed');

      expect(onUpdateFn).toHaveBeenCalledWith('changed');
    });

    test('Calls only onUpdate callback when receive update via setValue', () => {
      const onUpdateFn = vi.fn();

      const control = new FormControl('', { onUpdate: onUpdateFn });

      control.setValue('123');

      expect(onUpdateFn).toHaveBeenCalledWith('123');
    });
  });

  describe('Focus state', () => {
    test('Not focused by default', () => {
      const control = new FormControl('');

      expect(control.isFocused).toBeFalsy();
    });

    test('Focused after trigging register().onFocus', () => {
      const control = new FormControl('');

      control.onFocus();

      expect(control.isFocused).toBeTruthy();
    });

    test('Change isFocus after blur', () => {
      const control = new FormControl('');

      const { onFocus, onBlur } = control;

      expect(control.isFocused).toBeFalsy();

      onFocus();
      expect(control.isFocused).toBeTruthy();

      onBlur();
      expect(control.isFocused).toBeFalsy();
    });

    test('Calls onFocus callback when receive focus', () => {
      const fn = vi.fn();

      const control = new FormControl('', { onFocus: fn });

      control.onFocus();

      expect(control.isFocused).toBeTruthy();
      expect(fn).toHaveBeenCalled();
    });

    test('Calls onFocus repeatedly', () => {
      const fn = vi.fn();

      const control = new FormControl('', { onFocus: fn });

      const { onFocus } = control;

      onFocus();
      onFocus();
      onFocus();

      expect(fn).toHaveBeenCalledTimes(3);
    });


    test('Calls onFocus callback after blur', () => {
      const fn = vi.fn();

      const control = new FormControl('', { onFocus: fn });

      const { onFocus, onBlur } = control;

      expect(fn).not.toHaveBeenCalled();

      onFocus();

      expect(fn).toHaveBeenCalledTimes(1);

      onBlur();

      onFocus();

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Reset', () => {
    test('Resets to initial value', () => {
      const control = new FormControl('initial');

      control.setValue('123');

      control.reset();

      expect(control.value).toBe('initial');
    });

    test('Calls onUpdate callback when reset', () => {
      const onUpdateFn = vi.fn();
      const control = new FormControl('initial', { onUpdate: onUpdateFn });

      control.setValue('123');
      expect(onUpdateFn).toHaveBeenCalledWith('123');

      control.reset();

      expect(onUpdateFn).toHaveBeenCalledWith('initial');

      expect(onUpdateFn).toHaveBeenCalledTimes(2);
    });

    test.skip('Resets isFocused state', () => {
      const control = new FormControl('initial');

      // const { onBlur, onFocus, ref } = control

      // const el = document.createElement('input')

      // ref(el)

      // el.onblur = onBlur

      control.onFocus();

      expect(control.isFocused).toBeTruthy();

      control.reset();

      expect(control.isFocused).toBeFalsy();
    });

    test('Resets isDirty state', () => {
      const control = new FormControl('initial');

      control.setDirty(true);

      control.reset();

      expect(control.isDirty).toBeFalsy();
    });

    test('Resets errors state', () => {
      const control = new FormControl('initial');

      control.addError({ code: 'error' });

      expect(control.isValid).toBeFalsy();

      control.reset();

      expect(control.isValid).toBeTruthy();
    });
  });

  describe('FormControl TypeGuard', () => {
    test('FormControl', () => {
      const control = new FormControl('');

      expect(isFormControl(control)).toBeTruthy();
    });

    test('Not FormControl', () => {
      const control = {};

      expect(isFormControl(control)).toBeFalsy();
    });
  });
});
