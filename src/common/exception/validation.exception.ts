export class ValidationException extends Error {

  constructor(validationErrors: string[]) {
    super(validationErrors.join(', '));
  }
}
