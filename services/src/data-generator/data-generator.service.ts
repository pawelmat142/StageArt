import { Injectable, Logger } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { ProfileEmailService } from '../profile/profile-email.service';
import { Role } from '../profile/model/role';
import { ManagerData } from '../profile/model/profile-interfaces';
import { Country } from '../artist/model/artist.model';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { Profile } from '../profile/model/profile.model';
import { Util } from '../global/utils/util';
import { ArtistService } from '../artist/artist.service';
import { ArtistForm, SelectorItem } from '../artist/artist.controller';
import { ArtistViewDto } from '../artist/model/artist-view.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

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


    private async generateArtists() {
        const artistProfile = await this.generateArtist('Neon Reverie', this.ARTIST_EMAIL)
        this.ARTIST_SIGNATURE = artistProfile.signature
        // const artistProfile1 = await this.generateArtist('Pulse Machine')
        // const artistProfile2 = await this.generateArtist('Echo Synthesis')
        // const artistProfile3 = await this.generateArtist('Synthwave Odyssey')


        // this.artistService.createArtist(this.MANAGER_UID)

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

    private async generateArtist(name: string, email?: string): Promise<ArtistViewDto> {
        const mail = email ? email : Util.toKebabCase(name)
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



        return artist
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
}
