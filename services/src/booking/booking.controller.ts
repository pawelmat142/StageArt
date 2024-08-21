import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtGuard } from '../profile/auth/jwt.guard';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { Serialize } from '../global/interceptors/serialize.interceptor';
import { BookingListDto } from './model/booking.dto';
import { Booking } from './model/booking.model';
import { LogInterceptor } from '../global/interceptors/log.interceptor';

@Controller('api/booking')
@UseInterceptors(LogInterceptor)
export class BookingController {

    constructor(
        private readonly bookingService: BookingService,
    ) {}

    @Get('submit/:id')
    @UseGuards(JwtGuard)
    submitForm(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingService.submitForm(formId, profile)
    }

    @Get('list')
    @UseGuards(JwtGuard)
    @Serialize(BookingListDto)
    fetchProfileBookings(@GetProfile() profile: JwtPayload) {
        return this.bookingService.fetchProfileBookings(profile)
    }

    @Get('get/:id')
    @UseGuards(JwtGuard)
    @Serialize(Booking)
    fetchBooking(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingService.fetchBooking(formId, profile)
    }

    @Get('promoter-info')
    @UseGuards(JwtGuard)
    findPromoterInfo(@GetProfile() profile: JwtPayload) {
        return this.bookingService.findPromoterInfo(profile.uid)
    }

}
