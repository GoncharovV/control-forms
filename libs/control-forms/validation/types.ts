
export interface ValidationError {
  code: string;
  message?: string;
  meta?: any;
}

export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
}
