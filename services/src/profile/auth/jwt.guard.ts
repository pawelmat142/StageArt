import { ExecutionContext, ForbiddenException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Profile } from "../model/profile.model";
import { ProfileService } from "../profile.service";
import { AppJwtService } from "./app-jwt.service";


@Injectable()
export class JwtGuard extends AuthGuard('jwt') {

    protected logger = new Logger('Guard')

    constructor(
        private readonly jwtService: AppJwtService,
        private readonly profileService: ProfileService,
    ) {
        super()
    }

    profile: Profile | undefined

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()

        try {
            const token = this.jwtService.extractToken(request)
            if (!token) {
                this.logger.error('Token not found')
                throw new ForbiddenException()
            }
            const secret = process.env.JWT_SECRET
            const payload = this.jwtService.verify(token, { secret })
            if (!payload) {
                this.logger.error('No payload')
                throw new ForbiddenException()
            }
            if (!payload.uid) {
                this.logger.error('uid not provided')
                throw new ForbiddenException()
            }
            this.profile = await this.profileService.findById(payload.uid)
            this.verifyRole()

            const tokenExpider = this.jwtService.isExpired(payload)
            if (tokenExpider) {
                this.logger.warn('Token expired')
                throw new UnauthorizedException()
            }
            const newToken = this.jwtService.newToken(payload)
            response.header('Authorization', 'Bearer ' + newToken)
            request.profile = this.profile
            return true
        } catch (err) {
            this.logger.error(err.message)
            throw new ForbiddenException()
        }
    }

    protected verifyRole() {
    }
}
