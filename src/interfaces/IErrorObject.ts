import { CustomError } from '../helpers';

type errorData = string | object;

export interface IErrorObject extends Error {
  code?: string;
  data?: errorData;
}

export class BadRequestError extends CustomError {
  constructor(msg: string) {
    super(400, msg);
    this.name = 'BadRequestError';
  }
}
