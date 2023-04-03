import { Response } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import { CustomError } from './CustomError';

function respond(res: Response, data: any, httpCode: number): void {
  res.setHeader('Content-Type', 'application/json');

  res.writeHead(httpCode);
  res.end(JSON.stringify(data));
}

export function success(res: Response, response: any, status = 200): void {
  respond(res, response, status);
}

export function failure(res: Response, response: any, httpCode = 503): void {
  const data = response;
  data.error = true;
  respond(res, data, httpCode);
}

export function handleError(res: Response, err: any) {
  console.error(err);
  let code = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error Occurred';

  if (err instanceof CustomError) {
    code = err.code;
    message = err.message;
  }

  return failure(res, {
    message,
  }, code);
}
