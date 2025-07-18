import { HttpException, HttpStatus } from '@nestjs/common';

export class IllegalStateException extends HttpException {
  constructor(msg?: string) {
    super(msg || 'Not modified', HttpStatus.BAD_REQUEST);
  }
}
