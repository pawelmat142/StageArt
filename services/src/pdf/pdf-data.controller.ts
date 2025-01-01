import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { PdfDataService } from './pdf-data.service';
import { PdfTemplate } from './model/pdf-data';

@Controller('api/pdf-data')
@UseInterceptors(LogInterceptor)
export class PdfDataController {

    constructor(
        private readonly pdfDataService: PdfDataService,
    ) {}

    @Get('/default/:template')
    fetchSubmitted(@Param('template') template: PdfTemplate) {
        return this.pdfDataService.getDefaultPdfData(template)
    }
}
