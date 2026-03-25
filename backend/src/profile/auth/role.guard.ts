import {
  ForbiddenException,
  Injectable,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import { AppJwtService } from './app-jwt.service';
import { ProfileService } from '../profile.service';

export function RoleGuard(role: string) {
  return mixin(
    class extends RoleGuardBase {
      constructor(
        readonly jwtService: AppJwtService,
        readonly profileService: ProfileService,
      ) {
        super(jwtService, profileService);
      }

      override verifyRole() {
        if (!role) {
          throw new ForbiddenException(`Not found role`);
        }
        if (!this.profile) {
          throw new ForbiddenException(`Not found profile`);
        }
        if (!this.profile.roles.includes(role)) {
          throw new UnauthorizedException(
            `Role ${role} doesnt match with profile roles: ${this.profile.roles.join(
              ', ',
            )}`,
          );
        }
        this.logger.log(
          `Passed profile ${this.profile.uid} with role: ${role}`,
        );
      }

      public returnNewToken(payload: any, request: any, response: any): boolean {
        const newToken = this.jwtService.newToken(payload);
        response.header('Authorization', 'Bearer ' + newToken);
        request.profile = this.profile;
        return true;
      }
    },
  );
}

@Injectable()
class RoleGuardBase extends JwtGuard {
  override get loggerName(): string {
    return 'RoleGuard';
  }

  constructor(
    protected readonly jwtService: AppJwtService,
    protected readonly profileService: ProfileService,
  ) {
    super(jwtService, profileService);
  }
}
