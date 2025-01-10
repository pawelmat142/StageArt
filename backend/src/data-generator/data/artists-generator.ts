import { Injectable, Logger } from "@nestjs/common"
import { ArtistService } from "../../artist/artist.service"
import { ProfileService } from "../../profile/profile.service"
import { ProfileEmailService } from "../../profile/profile-email.service"
import { ArtistViewDto } from "../../artist/model/artist-view.dto"
import { Profile } from "../../profile/model/profile.model"
import { ARTIST_LABEL, ARTIST_MEDIA, ARTIST_STYLE } from "./artist-info"
import { Role } from "../../profile/model/role"
import { Gen } from "../gen.util"
import { ArtistForm } from "../../artist/artist.controller"
import { ARTIST_IMAGES } from "./artist-images"
import { COUNTRIES } from "./countries"
import { JwtPayload } from "../../profile/auth/jwt-strategy"
import { ArtistLabel, ArtistMedia, ArtistStyle } from "../../artist/model/artist.model"

@Injectable()
export class ArtistsGenerator {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly profileEmailService: ProfileEmailService,
        private readonly artistService: ArtistService,
    ) {}

    private ARTISTS: ArtistViewDto[] = []
    private MANAGER: Profile

        readonly ARTIST_EMAIL = 'artist@test'
    ARTIST_SIGNATURE = 'ARTIST_SIGNATURE'

    public async generateArtistss(manager: Profile): Promise<ArtistViewDto[]> {
        this.MANAGER = manager
        await this.generateArtists()
        return this.ARTISTS
    }

    private async generateArtists() {
        let i = 0;
        const artistProfile = await this.generateArtist(
            'Neon Reverie', 
            this.ARTIST_EMAIL, 0, 
            [ARTIST_LABEL[0], ARTIST_LABEL[1]], //0-4, 
            [ARTIST_STYLE[0], ARTIST_STYLE[1], ARTIST_STYLE[2]], //0-8
            [ ARTIST_MEDIA.instagram, ARTIST_MEDIA.soundcloud, ARTIST_MEDIA.spotify ]
        )
        this.ARTIST_SIGNATURE = artistProfile.signature
        const artistProfile2 = await this.generateArtist('Pulse Machine', '', 1, [ARTIST_LABEL[2]], [ARTIST_STYLE[3], ARTIST_STYLE[2]], [ARTIST_MEDIA.instagram, ARTIST_MEDIA.bandcamp, ARTIST_MEDIA.spotify])
        const artistProfile3 = await this.generateArtist('Echo Synthesis', '', 2, [ARTIST_LABEL[3], ARTIST_LABEL[4]], [ARTIST_STYLE[3], ARTIST_STYLE[4]], [ARTIST_MEDIA.soundcloud, ARTIST_MEDIA.bandcamp,ARTIST_MEDIA.instagram, ARTIST_MEDIA.you_tube])
        const artistProfile4 = await this.generateArtist('Synthwave Odyssey', '', 3, [ARTIST_LABEL[0]], [ARTIST_STYLE[3], ARTIST_STYLE[2]], [ARTIST_MEDIA.instagram, ARTIST_MEDIA.spotify, ARTIST_MEDIA.facebook, ARTIST_MEDIA.bandcamp])
        
        const artistProfile5 = await this.generateArtist('Infinity Circuit', '', 4, [], [ARTIST_STYLE[3], ARTIST_STYLE[2]], [ARTIST_MEDIA.instagram, ARTIST_MEDIA.spotify, ARTIST_MEDIA.facebook, ARTIST_MEDIA.bandcamp])
        const artistProfile6 = await this.generateArtist('Arctic Bass', '', 5, [ARTIST_LABEL[1]], [ARTIST_STYLE[3], ARTIST_STYLE[2]], [ARTIST_MEDIA.instagram, ARTIST_MEDIA.you_tube,  ARTIST_MEDIA.spotify, ARTIST_MEDIA.soundcloud])
        const artistProfile7 = await this.generateArtist('Quantum Beats', '', 6, [ARTIST_LABEL[2]], [ARTIST_STYLE[8], ARTIST_STYLE[1],ARTIST_STYLE[7]], [ARTIST_MEDIA.instagram, ARTIST_MEDIA.spotify, ARTIST_MEDIA.soundcloud])
        const artistProfile8 = await this.generateArtist('Crystal Oscillator', '', 7, [ARTIST_LABEL[3], ARTIST_LABEL[1]], [ARTIST_STYLE[4], ARTIST_STYLE[5]], [ARTIST_MEDIA.instagram, ARTIST_MEDIA.spotify, ARTIST_MEDIA.facebook, ARTIST_MEDIA.you_tube])
        const artistProfile9 = await this.generateArtist('Stellar Waves', '', 8, [ARTIST_LABEL[4]], [ARTIST_STYLE[8], ARTIST_STYLE[0], ARTIST_STYLE[6], ARTIST_STYLE[7]], [ARTIST_MEDIA.instagram, ARTIST_MEDIA.bandcamp, ARTIST_MEDIA.facebook])
        
        this.ARTISTS.push(artistProfile)
        this.ARTISTS.push(artistProfile2)
        this.ARTISTS.push(artistProfile3)
        this.ARTISTS.push(artistProfile4)
        this.ARTISTS.push(artistProfile5)
        this.ARTISTS.push(artistProfile6)
        this.ARTISTS.push(artistProfile7)
        this.ARTISTS.push(artistProfile8)
        this.ARTISTS.push(artistProfile9)
    }

    private async generateArtist(name: string, email: string, index: number, labels?: ArtistLabel[], styles?: ArtistStyle[], medias?: ArtistMedia[]): Promise<ArtistViewDto> {
        const mail = email ? email : Gen.dotCom(name)
        const user = await this.profileEmailService.createProfile({
            name: name,
            role: { code: Role.ARTIST, name: Role.ARTIST },
            email: mail,
            password: mail,
        })
        this.logger.log(`Profile ${name} with role ARTIST created`)
        const nameSplit = name.split(' ')

        const artistForm: ArtistForm = {
            manager: { 
                code: this.MANAGER.uid,
                name: this.MANAGER.uid 
            },
            artistName: name,
            firstName: nameSplit?.length ? nameSplit[0] : name,
            lastName: nameSplit?.[1] ? nameSplit?.[1] : '',
            phoneNumber: Gen.PHONE_NUMBER,
            email: user.email
        }
        const artist = await this.artistService.createArtist(artistForm, { uid: user.uid } as JwtPayload )
        this.logger.log(`Artist created ${artist.name}`)

        // 
        const images = ARTIST_IMAGES[index] || ARTIST_IMAGES[0]
        if (images) {
            artist.images = images
        }
        artist.country = COUNTRIES[index] || COUNTRIES[0]
        artist.bio = this.getArtistBio(artist.name)
        artist.labels = labels
        artist.styles = styles
        artist.medias = medias
        const artistProfile = { uid: user.uid, artistSignature: artist.signature } as JwtPayload
        const managerProfile = { uid: this.MANAGER.uid } as JwtPayload
        await this.artistService.updateArtistView(artist, artistProfile )

        await this.artistService.putManagementNotes({
            managmentNotes: this.getArtistManagementNotes(index%2 + 1),
            artistSignture: artist.signature
        }, managerProfile)

        await this.artistService.setStatus('ACTIVE', artist.signature, managerProfile)
        return artist
    }

    private getArtistBio(name: string): string {
        return Gen.getRandomParagraphs().join('\n\n')
    }

    private getArtistManagementNotes(paragraphs: number): string {
        return Gen.getRandomParagraphs(paragraphs).join('\n\n')
    }


}