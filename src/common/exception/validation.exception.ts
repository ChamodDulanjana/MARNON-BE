import { Logger } from '@nestjs/common';

export class ValidationException extends Error {

  private readonly LOGGER = new Logger(ValidationException.name);

  constructor(validationErrors: string[]) {
      super(validationErrors.join(', '));
      // Log the validation errors
      this.LOGGER.warn(`Validation failed: ${this.message}`);
  }
}
