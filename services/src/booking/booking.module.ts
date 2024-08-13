import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './model/booking.model';
import { ConfigModule } from '@nestjs/config';
import { FormModule } from '../form/form.module';
import { ProfileModule } from '../profile/profile.module';
import { ArtistModule } from '../artist/artist.module';
import { SubmitService } from './util/submit.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Booking.name,
      schema: BookingSchema
    }]),

    ConfigModule,
    
    FormModule,
    ProfileModule,
    ArtistModule,
  ],
  providers: [BookingService, SubmitService],
  controllers: [BookingController]
})
export class BookingModule {}
