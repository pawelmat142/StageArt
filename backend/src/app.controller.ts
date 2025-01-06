import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LogInterceptor } from './global/interceptors/log.interceptor';

@Controller()
@UseInterceptors(LogInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api')
  getHello(): Object {
    return this.appService.getHello();
  }
}
