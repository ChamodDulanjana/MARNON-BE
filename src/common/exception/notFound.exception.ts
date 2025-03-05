export class NotFoundException extends Error {

  constructor(notFoundErrors: string[]) {
    super(notFoundErrors.join(', '));
  }
}