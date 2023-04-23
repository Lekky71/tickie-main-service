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

export class UnAuthorizedError extends CustomError {
  constructor(msg?: string) {
    super(401, msg || 'UnAuthorized');
    this.name = 'UnAuthorizedError';
  }
}

export class NotFoundError extends CustomError {
  constructor(msg?: string) {
    super(404, msg || 'NotFoundError');
    this.name = 'NotFoundError';
  }
}
