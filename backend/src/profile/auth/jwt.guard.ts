import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Profile } from '../model/profile.model';
import { ProfileService } from '../profile.service';
import { AppJwtService } from './app-jwt.service';
import { Role } from '../model/role';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  get loggerName(): string {
    return JwtGuard.name;
  }

  public logger = new Logger(this.loggerName);

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
      if (!token) {
        throw new ForbiddenException(`Not found token`);
      }
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });
      if (!payload) {
        throw new ForbiddenException(`Not found payload`);
      }
      if (!payload.uid) {
        throw new ForbiddenException(`Not found uid`);
      }
      this.profile = await this.profileService.fetchForJwt(payload.uid);
      if (this.profile.roles.includes(Role.ADMIN)) {
        return this.returnNewToken(payload, request, response);
      }
      this.verifyRole();

      const tokenExpider = this.jwtService.isExpired(payload);
      if (tokenExpider) {
        throw new UnauthorizedException(`Token expired`);
      }
      return this.returnNewToken(payload, request, response);
    } catch (err) {
      this.logger.error(err.message);
      throw new ForbiddenException();
    }
  }

  protected returnNewToken(payload: any, request: any, response: any) {
    const newToken = this.jwtService.newToken(payload);
    response.header('Authorization', 'Bearer ' + newToken);
    request.profile = this.profile;
    return true;
  }

  protected verifyRole() { }
}
