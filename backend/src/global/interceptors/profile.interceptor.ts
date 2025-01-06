import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { AppJwtService } from '../../profile/auth/app-jwt.service';


@Injectable()
export class ProfileInterceptor implements NestInterceptor {

    constructor(
        private readonly jwtService: AppJwtService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest()
        const token = this.jwtService.extractToken(request)
        const payload = this.jwtService.getPayload(token)
        request.profile = payload
        return next
          .handle()
      }

}
