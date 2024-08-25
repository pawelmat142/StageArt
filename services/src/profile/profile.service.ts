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

    public findByArtistSignature(artistSignature: string) {
        return this.profileModel.findOne({ artistSignature })
    }

    public findTelegramChannedId(uid: string) {
        return this.profileModel.findOne({ uid }).select('telegramChannelId')
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
        await this.profileModel.updateOne({ uid: profile.uid }, { $set: { 
            promoterInfo: promoterInfo,
            modified: new Date()
        } })
    }

    async createProfile(_profile: Partial<Profile>, registerMode: RegisterMode) {
        const checkName = await this.profileModel.findOne({ name: _profile.name })
            .select({ _id: true })
        if (checkName) {
            throw new BadRequestException('Name already n use')
        }

        const profile = new this.profileModel({
            uid: _profile.uid,
            name: _profile.name,
            roles: _profile.roles,

            registerMode: registerMode,
            telegramChannelId: _profile.telegramChannelId,
            email: _profile.email,
            passwordHash: _profile.passwordHash,

            created: new Date()
        })

        await profile.save()
        this.logger.log(`Created user ${profile.name}, uid: ${profile.uid}`)
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
            artistSignature: artistSignature,
            modified: new Date()
        }})
        if (!update.modifiedCount) {
            throw new IllegalStateException(`Artist profile not modified, uid: ${_profile.uid},`)
        }
        this.logger.log(`Updated profile via created Artist entity`)
        return update
    }

}
