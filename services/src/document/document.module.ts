import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { ProfileModule } from '../profile/profile.module';
import { BookingContractDocumentService } from './generators/booking-contract.generator';

@Module({
  imports: [
    ProfileModule,
  ],
  providers: [
    DocumentService,
    BookingContractDocumentService,
  ],
  exports: [
    BookingContractDocumentService
  ],
})
export class DocumentModule {}
