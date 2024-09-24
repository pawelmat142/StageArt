import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { ProfileModule } from '../profile/profile.module';
import { BookingContractDocumentGenerator } from './generators/booking-contract.generator';
import { TechRiderDocumentGenerator } from './generators/tech-rider.generator';
import { MongooseModule } from '@nestjs/mongoose';
import { Paper, PaperSchema } from './paper-model';
import { DocumentController } from './document.controller';
import { BookingModule } from '../booking/booking.module';
import { ChecklistService } from './checklist.service';
import { SignatureService } from './signature.service';
import { Signature, SignatureSchema } from './signature.model';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Paper.name,
      schema: PaperSchema
    }, {
      name: Signature.name,
      schema: SignatureSchema
    }]),
    ProfileModule,
    BookingModule,
  ],
  controllers: [
    DocumentController
  ],
  providers: [
    DocumentService,
    BookingContractDocumentGenerator,
    TechRiderDocumentGenerator,
    ChecklistService,
    SignatureService,
  ],
})
export class DocumentModule {}
