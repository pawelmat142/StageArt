import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';
import { AppJwtService } from '../../profile/auth/app-jwt.service';


@Injectable()
export class ProfileInterceptor implements NestInterceptor {

    constructor(
        private readonly jwtService: AppJwtService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        const token = this.jwtService.extractToken(request)
        const secret = process.env.JWT_SECRET
        const payload = this.jwtService.verify(token, { secret })
        request.profile = payload
        return next
          .handle()
      }

}
