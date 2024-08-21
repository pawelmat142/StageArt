import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './model/artist.model';
import { ProfileModule } from '../profile/profile.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Artist.name,
      schema: ArtistSchema
    }]),

    ProfileModule,
    TelegramModule
  ],
  providers: [ArtistService],
  controllers: [ArtistController],
  exports: [ArtistService]
})
export class ArtistModule {}
