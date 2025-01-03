import { Module } from '@nestjs/common';
import { DataGeneratorController } from './data-generator.controller';
import { DataGeneratorService } from './data-generator.service';
import { ProfileModule } from '../profile/profile.module';
import { ArtistModule } from '../artist/artist.module';
import { ArtistsGenerator } from './data/artists-generator';
import { BookingModule } from '../booking/booking.module';
import { FormModule } from '../form/form.module';
import { BookingsGenerator } from './data/bookings-generator';

@Module({
  imports: [
    ProfileModule,
    ArtistModule,
    BookingModule,
    FormModule,
  ],
  controllers: [DataGeneratorController],
  providers: [
    DataGeneratorService,
    ArtistsGenerator,
    BookingsGenerator,
  ]
})
export class DataGeneratorModule {}
