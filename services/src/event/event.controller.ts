import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { EventService } from './event.service';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { NoGuard } from '../profile/auth/no-guard';

@Controller('api/event')
@UseInterceptors(LogInterceptor)
export class EventController {

    constructor(
        private readonly eventService: EventService,
    ) {}

    @Get('list/panel')
    @UseGuards(NoGuard)
    fetchPromoterEvents(@GetProfile() profile: JwtPayload) {
        return this.eventService.fetchPromoterEvents(profile)
    }

}
