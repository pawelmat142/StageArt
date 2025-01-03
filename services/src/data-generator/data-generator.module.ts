import { Module } from '@nestjs/common';
import { DataGeneratorController } from './data-generator.controller';
import { DataGeneratorService } from './data-generator.service';
import { ProfileModule } from '../profile/profile.module';
import { ArtistModule } from '../artist/artist.module';

@Module({
  imports: [
    ProfileModule,
    ArtistModule,
  ],
  controllers: [DataGeneratorController],
  providers: [DataGeneratorService]
})
export class DataGeneratorModule {}
