import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { ProfileModule } from '../profile/profile.module';
import { BookingContractDocumentGenerator } from './generators/booking-contract.generator';
import { TechRiderDocumentGenerator } from './generators/tech-rider.generator';

@Module({
  imports: [
    ProfileModule,
  ],
  providers: [
    DocumentService,
    BookingContractDocumentGenerator,
    TechRiderDocumentGenerator,
  ],
  exports: [
    BookingContractDocumentGenerator,
    TechRiderDocumentGenerator,
  ],
})
export class DocumentModule {}
