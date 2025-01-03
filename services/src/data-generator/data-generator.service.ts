import { Injectable, Logger } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { ProfileEmailService } from '../profile/profile-email.service';
import { Role } from '../profile/model/role';
import { ManagerData } from '../profile/model/profile-interfaces';
import { ArtistLabel, ArtistMedia, ArtistStyle, Country } from '../artist/model/artist.model';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { Profile } from '../profile/model/profile.model';
import { Util } from '../global/utils/util';
import { ArtistService } from '../artist/artist.service';
import { ArtistForm, SelectorItem } from '../artist/artist.controller';
import { ArtistViewDto } from '../artist/model/artist-view.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ARTIST_IMAGES } from './data/artist-images';
import { COUNTRIES } from './data/countries';
import { ARTIST_LABEL, ARTIST_MEDIA, ARTIST_STYLE } from './data/artist-info';

@Injectable()
export class DataGeneratorService {

    private readonly logger = new Logger(this.constructor.name)

    private readonly now = new Date()

    constructor(
        private readonly profileService: ProfileService,
        private readonly profileEmailService: ProfileEmailService,
        private readonly artistService: ArtistService,
        @InjectConnection() private readonly connection: Connection
    ) {}

    readonly MANAGER = 'Sonic Circuit Agency'
    readonly MANAGER_EMAIL = 'manager@test.com'
    MANAGER_UID = 'MANAGER_UID'
    
    
    readonly ARTIST_EMAIL = 'artist@test.com'
    ARTIST_SIGNATURE = 'ARTIST_SIGNATURE'

    ARTISTS: ArtistViewDto[] = []

    readonly MANAGER_2 = 'SynthSphere Booking'
    readonly MANAGER_2_EMAIL = 'manager@synth-sphere-booking.com'

    readonly PUBLIC_PASSWORD = 'test123'

    readonly PHONE_NUMBER = `+48 600 123 456`

    readonly POLAND: Country =  {
        code: "PL",
        imgUrl: "https://flagcdn.com/pl.svg",
        name: "Poland"
    }


    async dataGenerator() {
        await this.cleanDatabase()

        await this.generateManagers()
        await this.generateArtists()
    }

    async cleanDatabase() {
        const collections = Object.keys(this.connection.collections);
        for (const collectionName of collections) {
          const collection = this.connection.collections[collectionName];
          await collection.deleteMany({});
          console.log(`Cleaned collection: ${collectionName}`);
        }
    }

    private async generateManagers() {
        const managerData: ManagerData = {
            agencyName: this.MANAGER,
            agencyCompanyName: `${this.MANAGER} Sp. z o.o`,
            nameOfBank: `Turbo Bank`,
            accountHolder: `Adam Małysz`,
            agencyCountry: this.POLAND,
            accountAddress: `ul. Warszawska 15, 00-950 Warszawa`,
            accountNumber: `PL89 1234 5678 9012 3456 7890 1234`,
            accountSwift: `PL89 1234 5678 9012 3456 7890 1234`,
            agencyEmail: this.MANAGER_EMAIL,
            agencyPhone: this.PHONE_NUMBER
        }
        const manager = await this.generateManager(this.MANAGER, this.MANAGER_EMAIL, managerData)
        this.MANAGER_UID = manager.uid
        await this.generateManager(this.MANAGER_2, this.MANAGER_2_EMAIL)
    }


    // export const artistMediaCodes = [
    //     '', 
    //     'facebook', 
    //     'instagram', 
    //     'soundcloud', 
    //     'bandcamp',
    //     'spotify',
    //     'you_tube',
    //     'website'
    // ] as const

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
        const mail = email ? email : `${Util.toKebabCase(name)}@test.com`
        const user = await this.profileEmailService.createProfile({
            name: name,
            role: { code: Role.ARTIST, name: Role.ARTIST },
            email: mail,
            password: this.PUBLIC_PASSWORD,
        })
        this.logger.log(`Profile ${name} with role ARTIST created`)
        const nameSplit = name.split(' ')

        const artistForm: ArtistForm = {
            manager: { 
                code: this.MANAGER_UID, 
                name: this.MANAGER_UID 
            },
            artistName: name,
            firstName: nameSplit?.length ? nameSplit[0] : name,
            lastName: nameSplit?.[1] ? nameSplit?.[1] : '',
            phoneNumber: this.PHONE_NUMBER,
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
        const managerProfile = { uid: this.MANAGER_UID } as JwtPayload
        await this.artistService.updateArtistView(artist, artistProfile )

        await this.artistService.putManagementNotes({
            managmentNotes: this.getArtistManagementNotes(index%2 + 1),
            artistSignture: artist.signature
        }, managerProfile)

        await this.artistService.setStatus('ACTIVE', artist.signature, managerProfile)
        return artist
    }

    private getArtistBio(name: string): string {
        return this.getRandomParagraphs(this.paragraphs).join('\n\n')
    }

    private getArtistManagementNotes(paragraphs: number): string {
        return this.getRandomParagraphs(this.paragraphs, paragraphs).join('\n\n')
    }

    private async generateManager(name: string, email: string, managerData?: ManagerData): Promise<Profile> {
        const user = await this.profileEmailService.createProfile({
            name: name,
            role: { code: Role.MANAGER, name: Role.MANAGER },
            email: email,
            password: this.PUBLIC_PASSWORD,
        })
        if (managerData) {
            await this.profileService.setManagerData(managerData, { uid: user.uid } as JwtPayload)
        }
        this.logger.log(`MANAGER ${name} generated`)
        return user
    }

    private getRandomParagraphs(arr: string[], paragraphs?: number) {
        const numElements = paragraphs || Math.floor(Math.random() * (arr.length - 1)) + 1; // Random number between 1 and arr.length - 1
        const shuffledArr = [...arr].sort(() => Math.random() - 0.5); // Shuffle the array
        return shuffledArr.slice(0, numElements);
    }

    readonly paragraphs: string[] = [
        `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
        `Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
        `It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
        `It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.`,
        `The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
        `Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.`,
        `Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`,
        `The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`
    ]
}
