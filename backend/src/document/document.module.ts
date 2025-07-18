import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { ProfileModule } from '../profile/profile.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Paper, PaperSchema } from './paper-model';
import { DocumentController } from './document.controller';
import { BookingModule } from '../booking/booking.module';
import { ChecklistService } from './checklist.service';
import { SignatureService } from './signature.service';
import { Signature, SignatureSchema } from './signature.model';
import { ContractPaperDataProvider } from './generators/contract-paper-data-povider';
import { TechRiderDataProvider } from './generators/tech-rider-data.provider';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Paper.name,
        schema: PaperSchema,
      },
      {
        name: Signature.name,
        schema: SignatureSchema,
      },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    ProfileModule,
    BookingModule,
    PdfModule,
  ],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    ChecklistService,
    SignatureService,
    ContractPaperDataProvider,
    TechRiderDataProvider,
    UploadsService,
  ],
})
export class DocumentModule {}
