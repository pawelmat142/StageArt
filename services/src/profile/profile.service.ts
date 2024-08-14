import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, RegisterMode } from './model/profile.model';
import { Model } from 'mongoose';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { JwtPayload } from './auth/jwt-strategy';
import { ArtistService } from '../artist/artist.service';

export interface Credentials {
    email: string
    password: string
}

@Injectable()
export class ProfileService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
        private readonly artistService: ArtistService
    ) {}

    public findById(uid: string) {
        return this.profileModel.findOne({ uid })
    }


    public async updatePromoterInfoWhenSubmitForm(formData: any, profile: JwtPayload) {
        const promoterInfo = formData.promoterInformation
        if (!promoterInfo) {
            throw new IllegalStateException('Not found promoter info')
        }
        await this.profileModel.updateOne({ uid: profile.uid }, { $set: { promoterInfo: promoterInfo } })
    }

    async createProfile(profile: Partial<Profile>, registerMode: RegisterMode) {

        const checkName = await this.profileModel.findOne({ name: profile.name })
        if (checkName) {
            throw new BadRequestException('Name already n use')
        }

        const user = new this.profileModel({
            uid: profile.uid,
            name: profile.name,
            role: profile.role,

            registerMode: registerMode,
            telegramChannelId: profile.telegramChannelId,
            email: profile.email,
            passwordHash: profile.passwordHash,

            created: new Date(),
            modified: new Date(),
        })

        if (profile.role === 'ARTIST') {
            const artist = await this.artistService.createPlainArtist(user)
            user.artistSignature = artist.signature
        }

        await user.save()
        this.logger.log(`Created user ${user.name}, uid: ${user.uid}`)
    }


}
