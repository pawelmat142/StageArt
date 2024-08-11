import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {

  private readonly logger = new Logger(this.constructor.name)
  getHello(): Object {
    this.logger.log('Hello World')
    return { data: 'Hello World' };
  }
}
