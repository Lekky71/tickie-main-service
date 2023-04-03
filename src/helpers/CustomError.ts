export class CustomError extends Error {
  code: number;
  data?: object;

  constructor(code: number, message: string, data?: object) {
    super();
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
