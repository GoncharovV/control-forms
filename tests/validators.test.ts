/* eslint-disable @stylistic/no-multi-spaces */
import { ErrorCodes, ValidatorFunction, Validators } from '../libs/control-forms';


describe('Validators', () => {
  describe('Required', () => {
    let validator: ValidatorFunction;

    beforeEach(() => {
      validator = Validators.required();
    });

    test('Empty string (invalid)', async () => {
      const result =  await validator('');

      expect(result.success).toBeFalsy();
      expect(result.errors).toEqual([{ code: ErrorCodes.REQUIRED }]);
    });

    test('undefined (invalid)', async () => {
      const result =  await validator(undefined);

      expect(result.success).toBeFalsy();
      expect(result.errors).toEqual([{ code: ErrorCodes.REQUIRED }]);
    });

    test('null (invalid)', async () => {
      const result =  await validator(null);

      expect(result.success).toBeFalsy();
      expect(result.errors).toEqual([{ code: ErrorCodes.REQUIRED }]);
    });

    test('NaN (invalid)', async () => {
      const result =  await validator(NaN);

      expect(result.success).toBeFalsy();
      expect(result.errors).toEqual([{ code: ErrorCodes.REQUIRED }]);
    });

    test('not empty object (valid)', async () => {
      const result =  await validator('C.C.');

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('empty object (valid)', async () => {
      const result =  await validator({});

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('object (valid)', async () => {
      const result =  await validator({ x: 46 });

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('number (valid)', async () => {
      const result =  await validator(1);

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('zero (valid)', async () => {
      const result =  await validator(0);

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('false (valid)', async () => {
      const result =  await validator(false);

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('true (valid)', async () => {
      const result =  await validator(true);

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('empty array (valid)', async () => {
      const result =  await validator([]);

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('array (valid)', async () => {
      const result =  await validator(['L.L.']);

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('function (valid)', async () => {
      const result =  await validator(() => {});

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('class (valid)', async () => {
      const result =  await validator(class Class {});

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('class object (valid)', async () => {
      const result =  await validator(new (class Class {})());

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });
  });

  describe('minLength', () => {
    test('too short (invalid)', async () => {
      const validator = Validators.minLength(4);

      const result = await validator('123');

      expect(result.success).toBeFalsy();
      expect(result.errors).toEqual([{ code: ErrorCodes.MIN_LENGTH }]);
    });

    test('equals (valid)', async () => {
      const validator = Validators.minLength(4);

      const result = await validator('1234');

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('more than (valid)', async () => {
      const validator = Validators.minLength(4);

      const result = await validator('123455231');

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('array too short (invalid)', async () => {
      const validator = Validators.minLength(2);

      const result = await validator([]);

      expect(result.success).toBeFalsy();
      expect(result.errors).toEqual([{ code: ErrorCodes.MIN_LENGTH }]);
    });

    test('array equals (valid)', async () => {
      const validator = Validators.minLength(2);

      const result = await validator([1, 2]);

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('array more than (valid)', async () => {
      const validator = Validators.minLength(2);

      const result = await validator([1, 2, 3, 4]);

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    describe('Invalid input', () => {
      test.each([
        ['undefined (invalid)',        undefined,               false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['null (invalid)',             null,                    false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['NaN (invalid)',              NaN,                     false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['empty object (invalid)',     {},                      false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['not empty object (invalid)', { x: 1 },                false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['number (invalid)',           5,                       false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['zero (invalid)',             0,                       false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['false (invalid)',            false,                   false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['true (invalid)',             true,                    false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['function (invalid)',         () => {},                false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['class (invalid)',            class Class {},          false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['class object (invalid)',     new (class Class {})(),  false,   [{ code: ErrorCodes.TYPE_ERROR }]],
      ])('%s', async (_, value, success, errors) => {
        const validator = Validators.minLength(5);

        const result = await validator(value);

        expect(result.success).toEqual(success);
        expect(result.errors).toEqual(errors);
      });
    });
  });

  describe('maxLength', () => {
    test('too big (invalid)', async () => {
      const validator = Validators.maxLength(4);

      const result = await validator('12345');

      expect(result.success).toBeFalsy();
      expect(result.errors).toEqual([{ code: ErrorCodes.MAX_LENGTH }]);
    });

    test('equals (valid)', async () => {
      const validator = Validators.maxLength(4);

      const result = await validator('1234');

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('shorter than (valid)', async () => {
      const validator = Validators.maxLength(4);

      const result = await validator('121');

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('array too big (invalid)', async () => {
      const validator = Validators.maxLength(2);

      const result = await validator([1, 2, 3]);

      expect(result.success).toBeFalsy();
      expect(result.errors).toEqual([{ code: ErrorCodes.MAX_LENGTH }]);
    });

    test('array equals (valid)', async () => {
      const validator = Validators.maxLength(2);

      const result = await validator([1, 2]);

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    test('array shorter than (valid)', async () => {
      const validator = Validators.maxLength(2);

      const result = await validator([1]);

      expect(result.success).toBeTruthy();
      expect(result.errors).toEqual([]);
    });

    describe('Invalid input', () => {
      test.each([
        ['undefined (invalid)',        undefined,               false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['null (invalid)',             null,                    false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['NaN (invalid)',              NaN,                     false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['empty object (invalid)',     {},                      false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['not empty object (invalid)', { x: 1 },                false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['number (invalid)',           5,                       false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['zero (invalid)',             0,                       false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['false (invalid)',            false,                   false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['true (invalid)',             true,                    false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['function (invalid)',         () => {},                false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['class (invalid)',            class Class {},          false,   [{ code: ErrorCodes.TYPE_ERROR }]],
        ['class object (invalid)',     new (class Class {})(),  false,   [{ code: ErrorCodes.TYPE_ERROR }]],
      ])('%s', async (_, value, success, errors) => {
        const validator = Validators.maxLength(5);

        const result = await validator(value);

        expect(result.success).toEqual(success);
        expect(result.errors).toEqual(errors);
      });
    });
  });
});
