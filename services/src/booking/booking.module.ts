import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './model/booking.model';
import { ConfigModule } from '@nestjs/config';
import { FormModule } from '../form/form.module';
import { ProfileModule } from '../profile/profile.module';
import { ArtistModule } from '../artist/artist.module';
import { EventModule } from '../event/event.module';
import { TelegramModule } from '../telegram/telegram.module';
import { BookingService } from './services/booking.service';
import { SubmitService } from './services/submit.service';

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
    EventModule,
    TelegramModule,
  ],
  providers: [BookingService, SubmitService],
  controllers: [BookingController]
})
export class BookingModule {}
