import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger(this.constructor.name)
    
    catch(exception: unknown, host: ArgumentsHost) {
        this.logger.error(exception)
    }
    
}