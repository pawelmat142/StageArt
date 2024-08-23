import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { EventService } from './event.service';
import { RoleGuard } from '../profile/auth/role.guard';
import { Role } from '../profile/model/role';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { JwtPayload } from '../profile/auth/jwt-strategy';

@Controller('api/event')
@UseInterceptors(LogInterceptor)
export class EventController {

    constructor(
        private readonly eventService: EventService,
    ) {}

    @Get('list/panel')
    @UseGuards(RoleGuard(Role.PROMOTOR))
    fetchPromotorEvents(@GetProfile() profile: JwtPayload) {
        return this.eventService.fetchPromotorEvents(profile)
    }

}
