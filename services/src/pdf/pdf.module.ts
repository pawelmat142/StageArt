import { Module } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';
import { PdfDataController } from './pdf-data.controller';
import { PdfDataService } from './pdf-data.service';

@Module({
  providers: [PdfGeneratorService, PdfDataService],
  exports: [PdfGeneratorService],
  controllers: [PdfDataController]
})
export class PdfModule {}
