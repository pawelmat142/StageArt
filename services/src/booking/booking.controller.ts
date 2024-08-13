import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtGuard } from '../profile/auth/jwt.guard';
import { Profile } from '../profile/auth/profile-path-param-getter';
import { JwtPayload } from '../profile/auth/jwt-strategy';

@Controller('api/booking')
export class BookingController {

    constructor(
        private readonly bookingService: BookingService,
    ) {}

    @Get('submit/:id')
    @UseGuards(JwtGuard)
    submitForm(@Param('id') formId: string, @Profile() profile: JwtPayload) {
        return this.bookingService.submitForm(formId, profile)
    }

}
