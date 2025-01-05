import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Serialize } from '../global/interceptors/serialize.interceptor';
import { ArtistViewDto } from './model/artist-view.dto';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { JwtGuard } from '../profile/auth/jwt.guard';
import { RoleGuard } from '../profile/auth/role.guard';
import { Role } from '../profile/model/role';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { ArtistStatus } from './model/artist.model';
import { TimelineItem } from '../booking/services/artist-timeline.service';

export interface FetchArtistQuery {
    name?: string
    signature?: string
}

export interface SelectorItem {
    code: string
    name: string
}

export interface ArtistForm {
    manager: SelectorItem,
    artistName: string
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
}

@Controller('api')
@UseInterceptors(LogInterceptor)
export class ArtistController {
    
    constructor(
        private readonly artistService: ArtistService,
    ) {}

    @Post('artist/create')
    @Serialize(ArtistViewDto)
    @UseGuards(JwtGuard)
    createArtist(@Body() artist: ArtistForm, @GetProfile() profile: JwtPayload) {
        return this.artistService.createArtist(artist, profile)
    }

    @Get('artist')
    @Serialize(ArtistViewDto)
    fetchArtist(@Query() query: FetchArtistQuery) {
        return this.artistService.fetchArtist(query)
    }

    @Get('artists')
    @Serialize(ArtistViewDto)
    fetchArtists() {
        return this.artistService.fetchArtists()
    }
    
    @Put('artist')
    @UseGuards(JwtGuard)
    updateArtistView(@Body() artist: ArtistViewDto, @GetProfile() profile: JwtPayload) {
        return this.artistService.updateArtistView(artist, profile)
    }

    @Get('list-music-styles')
    listMusicStyles() {
        return this.artistService.listMusicStyles() 
    }

    @Get('artist/list-labels')
    listArtistLabels() {
        return this.artistService.listArtistLabels()
    }


    // TODO artist manager service - refactor
    @Get('artists/of-manager')
    @UseGuards(RoleGuard(Role.MANAGER))
    @Serialize(ArtistViewDto)
    fetchArtistsOfManager(@GetProfile() profile: JwtPayload) {
        return this.artistService.fetchArtistsOfManager(profile)
    }

    @Put('artist/management-notes')
    @UseGuards(RoleGuard(Role.MANAGER))
    putManagementNotes(@Body() body: { managmentNotes: string, artistSignture: string }, @GetProfile() profile: JwtPayload) {
        return this.artistService.putManagementNotes(body, profile)
    }

    @Put('artist/set-status/:status/:signature')
    @UseGuards(RoleGuard(Role.MANAGER))
    setStatus(
        @Param('status') status: ArtistStatus, 
        @Param('signature') signature: string, 
        @GetProfile() profile: JwtPayload
    ) {
        return this.artistService.setStatus(status, signature, profile)
    }

    @Get(`artist/timeline`)
    getTimeline(
        @Param('artistSignature') artistSignature: string
    ): Promise<{ timeline: TimelineItem[] }> {
        return this.artistService.getTimeline(artistSignature)
    }

    @Put(`artist/submit-timeline-event/:artistSignature`)
    @UseGuards(RoleGuard(Role.MANAGER))
    submitTimelineEvent(
        @Param('artistSignature') artistSignature: string,
        @Body() body: TimelineItem,
        @GetProfile() profile: JwtPayload
    ) {
        return this.artistService.submitTimelineEvent(artistSignature, body, profile)
    }

}



