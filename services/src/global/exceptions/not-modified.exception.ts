import { HttpException, HttpStatus } from '@nestjs/common';


export class NotModifiedException extends HttpException {

    constructor() {
        super('Not modified', HttpStatus.NOT_MODIFIED);
    }
}