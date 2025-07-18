import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './model/artist.model';
import { ProfileModule } from '../profile/profile.module';
import { TelegramModule } from '../telegram/telegram.module';
import { ArtistManagerService } from './artist-manager.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Artist.name,
        schema: ArtistSchema,
      },
    ]),

    ProfileModule,
    TelegramModule,
  ],
  providers: [ArtistService, ArtistManagerService],
  controllers: [ArtistController],
  exports: [ArtistService, ArtistManagerService],
})
export class ArtistModule {}
