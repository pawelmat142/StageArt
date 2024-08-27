import { Controller, Get, Param, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from '../profile/auth/jwt.guard';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { Serialize, SerializeBookingDto } from '../global/interceptors/serialize.interceptor';
import { BookingDto } from './model/booking.dto';
import { Booking } from './model/booking.model';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { BookingService } from './services/booking.service';
import { BookingCancelService } from './services/booking-cancel.service';
import { BookingDocumentsService } from './services/booking-documents.service';
import { Response } from 'express';
import { Template } from '../document/doc-util';
import { RoleGuard } from '../profile/auth/role.guard';
import { Role } from '../profile/model/role';

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
    @UseGuards(JwtGuard)
    findPromoterInfo(@GetProfile() profile: JwtPayload) {
        return this.bookingService.findPromoterInfo(profile.uid)
    }

    @Get('cancel/:id')
    @UseGuards(JwtGuard)
    @Serialize(BookingDto)
    cancelBooking(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingCancelService.cancelBooking(formId, profile)
    }

    @Get('request-documents/:id')
    @UseGuards(JwtGuard)
    @Serialize(BookingDto)
    requestDocuments(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.bookingDocumentsService.requestDocuments(formId, profile)
    }

    @Get('get-pdf/:id/:template')
    @UseGuards(JwtGuard)
    async getPdf(
        @Res() res: Response,
        @Param('id') formId: string,
        @Param('template') template: Template,
        @GetProfile() profile: JwtPayload
    ) {
        const buffer = await this.bookingDocumentsService.getPdf(formId, template, profile)
        this.pdfResponse(res, buffer, template)
    }

    @Get('sign-contract/:id')
    @UseGuards(RoleGuard(Role.PROMOTER))
    async signContract(
        @Res() res: Response,
        @Param('id') formId: string,
        @GetProfile() profile: JwtPayload
    ) {
        const buffer = await this.bookingDocumentsService.signContract(formId, profile)
        this.pdfResponse(res, buffer, 'contract')
    }

    private pdfResponse(res: Response, buffer: Buffer, filename: string) {
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}.pdf"`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }

}
