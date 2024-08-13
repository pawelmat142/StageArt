import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './model/artist.model';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Artist.name,
      schema: ArtistSchema
    }]),
  ],
  providers: [ArtistService],
  controllers: [ArtistController],
  exports: [ArtistService]
})
export class ArtistModule {}
