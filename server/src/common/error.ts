export class ApiError extends Error {
  statusCode: number;
  success: false = false;
  errors: unknown[];
  code?: string;

  constructor(
    statusCode: number,
    message = 'Something went wrong',
    errors: unknown[] = [],
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
