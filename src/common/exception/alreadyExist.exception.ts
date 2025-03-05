export class AlreadyExistException extends Error {

  constructor(alreadyExistErrors: string[]) {
    super(alreadyExistErrors.join(', '));
  }
}