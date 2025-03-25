import { Injectable, Logger } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { ProfileEmailService } from '../profile/profile-email.service';
import { Role } from '../profile/model/role';
import { ManagerData } from '../profile/model/profile-interfaces';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { Profile } from '../profile/model/profile.model';
import { ArtistViewDto } from '../artist/model/artist-view.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { COUNTRIES } from './data/countries';
import { Gen } from './gen.util';
import { ArtistsGenerator } from './data/artists-generator';
import { BookingsGenerator } from './data/bookings-generator';
import { Booking } from '../booking/model/booking.model';

@Injectable()
export class DataGeneratorService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly profileService: ProfileService,
        private readonly profileEmailService: ProfileEmailService,
        private readonly artistsGenerator: ArtistsGenerator,
        private readonly bookingsGenerator: BookingsGenerator,
        @InjectConnection() private readonly connection: Connection
    ) {}

    // INPUTS
    readonly MANAGER_EMAIL = 'manager@test'
    readonly MANAGER_2 = 'SynthSphere Booking'
    readonly MANAGER_2_EMAIL = 'manager@synth-sphere-booking.com'


    // OUTPUT
    MANAGER: Profile = { name: 'MANAGER_NAME' } as Profile
    ARTISTS: ArtistViewDto[] = []
    PROMOTERS: Profile[] = []
    BOOKINGS: Booking[] = []
    

    async dataGenerator() {
        await this.cleanDatabase()
        await this.generateManagers()
        this.ARTISTS = await this.artistsGenerator.generateArtistss(this.MANAGER)
        this.PROMOTERS = await this.generatePromoters()
        this.BOOKINGS = await this.bookingsGenerator.generate(this.PROMOTERS, this.ARTISTS)
    }

    async cleanDatabase() {
        const collections = Object.keys(this.connection.collections);
        for (const collectionName of collections) {
          const collection = this.connection.collections[collectionName];
          await collection.deleteMany({});
          console.log(`Cleaned collection: ${collectionName}`);
        }
    }

    private async generatePromoters(): Promise<Profile[]> {
        const result: Profile[] = [] 
        result.push(await this.generatePromoter(`James Taylor`, `promoter@test`))
        result.push(await this.generatePromoter(`Oliver Johnson`))
        result.push(await this.generatePromoter(`Thiago Almeida`))
        return result
    }

    private async generateManagers() {
        const managerData: ManagerData = {
            agencyName: this.MANAGER.name,
            agencyCompanyName: `${this.MANAGER.name} Sp. z o.o`,
            nameOfBank: `Turbo Bank`,
            accountHolder: `Adam Małysz`,
            agencyCountry: COUNTRIES[0],
            accountAddress: `ul. Warszawska 15, 00-950 Warszawa`,
            accountNumber: `PL89 1234 5678 9012 3456 7890 1234`,
            accountSwift: `PL89 1234 5678 9012 3456 7890 1234`,
            agencyEmail: this.MANAGER_EMAIL,
            agencyPhone: Gen.PHONE_NUMBER
        }
        const manager = await this.generateManager(this.MANAGER.name, this.MANAGER_EMAIL, managerData)
        this.MANAGER = manager
        await this.generateManager(this.MANAGER_2, this.MANAGER_2_EMAIL)
    }

    private async generateManager(name: string, email: string, managerData?: ManagerData): Promise<Profile> {
        const user = await this.profileEmailService.createProfile({
            name: name,
            role: { code: Role.MANAGER, name: Role.MANAGER },
            email: email,
            password: email,
        })
        if (managerData) {
            await this.profileService.setManagerData(managerData, { uid: user.uid } as JwtPayload)
        }
        this.logger.log(`MANAGER ${name} generated`)
        return user
    }

    private async generatePromoter(name: string, email?: string): Promise<Profile> {
        const mail = email ? email : Gen.dotCom(name)
        const user = await this.profileEmailService.createProfile({
            name: name,
            role: { code: Role.PROMOTER, name: Role.PROMOTER },
            email: mail,
            password: mail,
        })
        this.logger.log(`PROMOTER ${name} generated`)
        return user
    }
}
