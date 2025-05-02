import { ValidationError, ValidationResult } from './types';


interface ParseResult {
  success: boolean;
  error?: {
    errors: ValidationError[];
  };
}

export interface ZodValidationSchema {
  safeParseAsync: (value: unknown) => Promise<ParseResult>;
}

export async function zodAdapter(value: unknown, schema: ZodValidationSchema): Promise<ValidationResult> {
  const result = await schema.safeParseAsync(value);

  const errors = result.error?.errors.map(({ code, message }) => ({ code, message }));

  return {
    success: result.success,
    errors: errors ?? [],
  };
}
