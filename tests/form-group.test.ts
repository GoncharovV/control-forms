import { FormControl, FormGroup, isFormGroup, Validators } from '../libs/control-forms';


describe('FormGroup', () => {
  describe('Value', () => {
    test('Check Initial values', () => {
      const group = new FormGroup({
        name: new FormControl('123'),
      });

      expect(group.fields.name.value).toBe('123');
      expect(group.value).toEqual({ name: '123' });
    });

    test('Check set value', () => {
      const group = new FormGroup({
        a: new FormControl('A'),
        b: new FormControl('B'),
      });

      expect(group.value).toEqual({ a: 'A', b: 'B' });

      group.setValue({ a: 'B', b: 'A' });

      expect(group.value).toEqual({ a: 'B', b: 'A' });

      expect(group.fields.a.value).toEqual('B');
      expect(group.fields.b.value).toEqual('A');
    });

    test('Check set value for child control', () => {
      const group = new FormGroup({
        a: new FormControl('A'),
        b: new FormControl('B'),
      });

      group.fields.b.setValue('x');

      expect(group.value).toEqual({ a: 'A', b: 'x' });
    });
  });

  // TODO: Fix onUpdate
  describe.skip('FormGroup onUpdate call', () => {
    test('Basic onUpdate', () => {
      const onUpdate = vi.fn();

      const group = new FormGroup({
        name: new FormControl('123'),
      }, { onUpdate });

      group.setValue({ name: '-' });

      expect(onUpdate).toHaveBeenCalledWith({ name: '-' });
      expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    test('Not call onUpdate if value not changed', () => {
      const onUpdate = vi.fn();

      const group = new FormGroup({
        name: new FormControl('123'),
      }, { onUpdate });

      group.setValue({ name: '123' });
      group.setValue({ name: '123' });
      group.setValue({ name: '123' });

      expect(onUpdate).toHaveBeenCalledTimes(0);
    });

    test('Call onUpdate on reset', () => {
      const onUpdate = vi.fn();

      const group = new FormGroup({
        name: new FormControl('123'),
      }, { onUpdate });

      group.setValue({ name: '-' });

      group.reset();

      expect(onUpdate).toHaveBeenNthCalledWith(1, { name: '-' });
      expect(onUpdate).toHaveBeenNthCalledWith(2, { name: '123' });
    });
  });

  describe.skip('Validation', () => {

  });

  describe('Form submission', () => {
    test('Valid Submit', async () => {
      const onValidSubmit = vi.fn();
      const onInvalidSubmit = vi.fn();
      const onAnySubmit = vi.fn();

      const group = new FormGroup({
        name: new FormControl('Name'),
      }, { onValidSubmit, onInvalidSubmit, onAnySubmit });

      await group.submit();

      expect(onValidSubmit).toHaveBeenCalledWith({ name: 'Name' });
      expect(onInvalidSubmit).not.toHaveBeenCalled();
      expect(onAnySubmit).toHaveBeenCalled();
    });

    test('Invalid Submit', async () => {
      const onValidSubmit = vi.fn();
      const onInvalidSubmit = vi.fn();
      const onAnySubmit = vi.fn();

      const group = new FormGroup({
        name: new FormControl('Name', { validators: [Validators.maxLength(0)] }),
      }, { onValidSubmit, onInvalidSubmit, onAnySubmit });

      await group.submit();

      expect(onValidSubmit).not.toHaveBeenCalledWith();
      expect(onInvalidSubmit).toHaveBeenCalled();
      expect(onAnySubmit).toHaveBeenCalled();
    });
  });


  describe('FormGroup TypeGuard', () => {
    test('FormGroup', () => {
      const control = new FormGroup({});

      expect(isFormGroup(control)).toBeTruthy();
    });

    test('Not FormGroup', () => {
      const control = new FormControl('');

      expect(isFormGroup(control)).toBeFalsy();
    });
  });
});
