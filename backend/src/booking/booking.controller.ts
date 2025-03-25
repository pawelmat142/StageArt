import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from '../profile/auth/jwt.guard';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { Serialize, SerializeBookingDto } from '../global/interceptors/serialize.interceptor';
import { BookingDto } from './model/booking.dto';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { BookingService } from './services/booking.service';
import { BookingCancelService } from './services/booking-cancel.service';
import { BookingDocumentsService } from './services/booking-documents.service';
import { NoGuard } from '../profile/auth/no-guard';
import { ArtistTimelineService } from './services/artist-timeline.service';
import { DocumentsStepRequest } from './model/interfaces';

@Controller('api/booking')
@UseInterceptors(LogInterceptor)
export class BookingController {

    constructor(
        private readonly bookingService: BookingService,
        private readonly bookingCancelService: BookingCancelService,
        private readonly bookingDocumentsService: BookingDocumentsService,
        private readonly artistTimelineService: ArtistTimelineService,
    ) {}

    @Get('submit/:id')
    @UseGuards(JwtGuard)
    submitForm(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingService.submitForm(formId, profile)
    }

    @Get('list')
    @UseGuards(JwtGuard)
    @UseInterceptors(SerializeBookingDto)
    fetchProfileBookings(@GetProfile() profile: JwtPayload) {
        return this.bookingService.fetchProfileBookings(profile)
    }

    @Get('form-data/:id')
    @UseGuards(JwtGuard)
    fetchFormData(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingService.fetchFormData(formId, profile)
    }

    @Get('promoter-info')
    @UseGuards(NoGuard)
    findPromoterInfo(@GetProfile() profile?: JwtPayload) {
        return this.bookingService.findPromoterInfo(profile?.uid)
    }

    @Get('cancel/:id')
    @UseGuards(JwtGuard)
    @Serialize(BookingDto)
    cancelBooking(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingCancelService.cancelBooking(formId, profile)
    }

    @Post('request-documents')
    @UseGuards(JwtGuard)
    @Serialize(BookingDto)
    requestDocuments(
        @GetProfile() profile: JwtPayload,
        @Body() documentsStepRequest: DocumentsStepRequest
    ) {
        return this.bookingDocumentsService.requestDocuments(documentsStepRequest.formId, profile)
    }

    @Get('artist-timeline/:signature')
    artistTimeline(@Param('signature') artistSignature: string) {
        return this.artistTimelineService.getTimeline(artistSignature)
    }


    @Get('panel-artist-bookings/:signature')
    @UseGuards(JwtGuard)
    panelArtistBookings(@Param('signature') artistSignature: string, @GetProfile() profile: JwtPayload) {
        return this.bookingService.panelArtistBookings(artistSignature, profile)
    }

    @Get('fetch-full/:formId')
    @UseGuards(JwtGuard)
    @UseInterceptors(SerializeBookingDto)
    fetchFullBooking(@Param('formId') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingService.fetchFullBooking(formId, profile)
    }

}
