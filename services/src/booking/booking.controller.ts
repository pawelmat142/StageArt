import { Controller, Get, Param } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('api/booking')
export class BookingController {

    constructor(
        private readonly bookingService: BookingService

    ) {}

    @Get('submit/:id')
    submitForm(@Param('id') formId: string) {
        console.log()
        return this.bookingService.submitForm(formId)
    }

}
