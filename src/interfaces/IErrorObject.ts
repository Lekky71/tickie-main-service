type errorData = string | object;

export interface IErrorObject extends Error {
  code?: string;
  data?: errorData;
}

export class BadRequestError extends Error {
  code = 400;
  constructor(msg: string) {
    super(msg);
    this.name = 'BadRequestError';

  }
}
