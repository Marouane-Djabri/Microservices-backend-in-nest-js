

export class EmailSendingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Email sending error';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmailSendingError);
    }
  }
}
