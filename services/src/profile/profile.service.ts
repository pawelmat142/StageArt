import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, RegisterMode } from './model/profile.model';
import { Model } from 'mongoose';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { JwtPayload } from './auth/jwt-strategy';
import { ArtistForm } from '../artist/artist.controller';
import { AppJwtService } from './auth/app-jwt.service';

export interface Credentials {
    email: string
    password: string
}

@Injectable()
export class ProfileService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
        private readonly jwtService: AppJwtService,
    ) {}

    public findById(uid: string) {
        return this.profileModel.findOne({ uid })
    }

    public fetchForJwt(uid: string) {
        return this.profileModel.findOne({ uid })
            .select({ 
                uid: true,
                name: true,
                roles: true,
                artistSignature: true,
                telegramChannelId: true,
            })
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
            roles: profile.roles,

            registerMode: registerMode,
            telegramChannelId: profile.telegramChannelId,
            email: profile.email,
            passwordHash: profile.passwordHash,

            created: new Date(),
            modified: new Date(),
        })

        await user.save()
        this.logger.log(`Created user ${user.name}, uid: ${user.uid}`)
    }

    fetchManagers() {
        return this.profileModel.find({ roles: 'MANAGER' })
    }

    fetchFullProfile(payload: JwtPayload) {
        return this.profileModel.findOne({ uid: payload.uid })
    }

    async refreshToken(_profile: JwtPayload) {
        const profile = await this.profileModel.findOne({ uid: _profile.uid })
        const token = this.jwtService.signIn(profile)
        return { token: token }
    }

    async updateArtistProfile(form: ArtistForm, _profile: JwtPayload, artistSignature: string) {
        const update = await this.profileModel.updateOne({ uid: _profile.uid }, { $set: {
            firstName: form.firstName,
            lastName: form.lastName,
            contactEmail: form.email,
            phoneNumber: form.phoneNumber,
            artistSignature: artistSignature
        }})
        if (!update.modifiedCount) {
            throw new IllegalStateException(`Artist profile not modified, uid: ${_profile.uid},`)
        }
        this.logger.log(`Updated profile via created Artist entity`)
        return update
    }

}
