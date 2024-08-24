import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from '../profile/auth/jwt.guard';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { Serialize } from '../global/interceptors/serialize.interceptor';
import { BookingPanelDto } from './model/booking.dto';
import { Booking } from './model/booking.model';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { BookingService } from './services/booking.service';
import { BookingCancelService } from './services/booking-cancel.service';
import { BookingDocumentsService } from './services/booking-documents.service';

@Controller('api/booking')
@UseInterceptors(LogInterceptor)
export class BookingController {

    constructor(
        private readonly bookingService: BookingService,
        private readonly bookingCancelService: BookingCancelService,
        private readonly bookingDocumentsService: BookingDocumentsService,
    ) {}

    @Get('submit/:id')
    @UseGuards(JwtGuard)
    submitForm(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingService.submitForm(formId, profile)
    }

    @Get('list')
    @UseGuards(JwtGuard)
    @Serialize(BookingPanelDto)
    fetchProfileBookings(@GetProfile() profile: JwtPayload) {
        return this.bookingService.fetchProfileBookings(profile)
    }

    @Get('get/:id')
    @UseGuards(JwtGuard)
    @Serialize(Booking)
    fetchBooking(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingService.fetchBooking(formId, profile)
    }

    @Get('promotor-info')
    @UseGuards(JwtGuard)
    findPromotorInfo(@GetProfile() profile: JwtPayload) {
        return this.bookingService.findPromotorInfo(profile.uid)
    }

    @Get('cancel/:id')
    @UseGuards(JwtGuard)
    @Serialize(BookingPanelDto)
    cancelBooking(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingCancelService.cancelBooking(formId, profile)
    }

    @Get('request-documents/:id')
    @UseGuards(JwtGuard)
    @Serialize(BookingPanelDto)
    requestDocuments(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingDocumentsService.requestDocuments(formId, profile)
    }

}
