import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { NoGuard } from '../profile/auth/no-guard';
import { ArtistManagerService } from './artist-manager.service';

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
        private readonly artistManagerService: ArtistManagerService,
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

    @Get('artists/of-manager')
    @UseGuards(RoleGuard(Role.MANAGER))
    @Serialize(ArtistViewDto)
    fetchArtistsOfManager(@GetProfile() profile: JwtPayload) {
        return this.artistManagerService.fetchArtistsOfManager(profile)
    }

    @Put('artist/management-notes')
    @UseGuards(RoleGuard(Role.MANAGER))
    putManagementNotes(@Body() body: { managmentNotes: string, artistSignture: string }, @GetProfile() profile: JwtPayload) {
        return this.artistManagerService.putManagementNotes(body, profile)
    }

    @Put('artist/set-status/:status/:signature')
    @UseGuards(RoleGuard(Role.MANAGER))
    setStatus(
        @Param('status') status: ArtistStatus, 
        @Param('signature') signature: string, 
        @GetProfile() profile: JwtPayload
    ) {
        return this.artistManagerService.setStatus(status, signature, profile)
    }

    @Get(`artist/timeline`)
    getTimeline(
        @Param('artistSignature') artistSignature: string
    ): Promise<{ timeline: TimelineItem[] }> {
        return this.artistService.getTimeline(artistSignature)
    }

    @Put(`artist/submit-timeline-event/:artistSignature`)
    @UseGuards(NoGuard)
    submitTimelineEvent(
        @Param('artistSignature') artistSignature: string,
        @Body() body: TimelineItem,
        @GetProfile() profile: JwtPayload
    ) {
        return this.artistManagerService.submitTimelineEvent(artistSignature, body, profile)
    }

    @Delete(`artist/timeline/:artistSignature/:id`)
    @UseGuards(NoGuard)
    removeTimelineEvent(
        @Param('artistSignature') artistSignature: string,
        @Param('id') id: string,
        @GetProfile() profile: JwtPayload
    ) {
        this.artistManagerService.removeTimelineEvent(artistSignature, id, profile)
    }

}



