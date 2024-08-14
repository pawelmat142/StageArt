import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistForm } from './model/artist-form';
import { Serialize } from '../global/interceptors/serialize.interceptor';
import { ArtistViewDto } from './model/artist-view.dto';

@Controller('api')
export class ArtistController {
    
    constructor(
        private readonly artistService: ArtistService,
    ) {}

    @Post('artist')
    @Serialize(ArtistViewDto)
    createArtist(@Body() artist: ArtistForm) {
        return this.artistService.createArtist(artist)
    }

    @Get('artist/:name')
    @Serialize(ArtistViewDto)
    fetchArtist(@Param('name') name: string) {
        return this.artistService.fetchArtist(name)
    }
    
    @Get('artists')
    @Serialize(ArtistViewDto)
    fetchArtists() {
        return this.artistService.fetchArtists()
    }
    
    @Get('artist/find-name/:signature')
    findName(@Param('signature') signature: string) {
        return this.artistService.findName(signature)
    }

}



