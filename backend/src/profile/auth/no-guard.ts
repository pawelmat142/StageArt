import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Profile } from '../model/profile.model';
import { ProfileService } from '../profile.service';
import { AppJwtService } from './app-jwt.service';

@Injectable()
export class NoGuard extends AuthGuard('jwt') {
  //used only for attach profile reference to request context

  constructor(
    protected readonly jwtService: AppJwtService,
    protected readonly profileService: ProfileService,
  ) {
    super();
  }

  profile?: Profile;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    this.profile = undefined;

    try {
      const token = this.jwtService.extractToken(request);
      if (token) {
        const secret = process.env.JWT_SECRET;
        const payload = this.jwtService.verify(token, { secret });
        if (payload?.uid) {
          this.profile = await this.profileService.fetchForJwt(payload.uid);
          request.profile = this.profile;
        }
      }
    } catch (err) {}
    return true;
  }
}
