import { Module } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';
import { PdfDataController } from './pdf-data.controller';
import { PdfDataService } from './pdf-data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PdfData, PdfDataSchema } from './model/pdf-data.model';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: PdfData.name,
      schema: PdfDataSchema
    }]),
    ProfileModule
  ],
  providers: [PdfGeneratorService, PdfDataService],
  exports: [PdfGeneratorService],
  controllers: [PdfDataController]
})
export class PdfModule {}
