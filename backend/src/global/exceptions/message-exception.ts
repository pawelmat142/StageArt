import { HttpException } from '@nestjs/common';


export class MessageException extends HttpException {

    constructor(message: string) {
        super(message, 333);
    }
}