import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';

@Module({
  imports: [

  ],
  providers: [
    DocumentService,
  ],
  exports: [
    DocumentService
  ],
})
export class DocumentModule {}
