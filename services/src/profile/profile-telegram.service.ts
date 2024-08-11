import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './model/profile.model';
import { Model } from 'mongoose';
import { TelegramUtil } from '../telegram/util/telegram.util';
import { AppJwtService } from './auth/app-jwt.service';

export interface LoginToken {
    telegramChannelId: string
    token: string
    expiration: Date
    pin: string
}

@Injectable()
export class ProfileTelegramService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly jwtService: AppJwtService,
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
    ) {}

    private loginTokens: LoginToken[] = []

    public findByTelegram(telegramChannelId: string) {
        return this.profileModel.findOne({ telegramChannelId })
    }

    async loginByPin(input: Partial<LoginToken>) {
        const token = this.loginTokens.find(t => t.token === input.token)
        if (!token || new Date() > token.expiration) {
            throw new UnauthorizedException(`PIN is expired, try again`)
        }
        if (token.pin !== input.pin) {
            throw new UnauthorizedException(`Wrong PIN, try again`)
        }

        const profile = await this.findByTelegram(token.telegramChannelId)
        if (!profile) {
            throw new UnauthorizedException(`Profile not found`)
        }

        return { token: this.jwtService.signIn(profile) }
    }


    async loginToken(telegramChannelId: string): Promise<LoginToken> {
        const check = await this.profileModel.findOne({ telegramChannelId })
        if (!check) throw new BadRequestException('Not a member')

        const expiration = new Date()
        expiration.setMinutes(expiration.getMinutes() + 1)
        const loginToken: LoginToken = {
            telegramChannelId: telegramChannelId,
            token: TelegramUtil.loginToken(),
            pin: TelegramUtil.pin(),
            expiration
        }

        this.loginTokens = this.loginTokens.filter(t => t.telegramChannelId !== telegramChannelId)
        this.loginTokens.push(loginToken)

        return loginToken
    }


    async createProfile(profile: Partial<Profile>) {

        const checkName = await this.profileModel.findOne({ name: profile.name })
        if (checkName) throw new BadRequestException('Name in use')

        if (profile.telegramChannelId) {
            const checkTelegram = await this.profileModel.findOne({ 
                telegramChannelId: profile.telegramChannelId
            })
            if (checkTelegram) throw new BadRequestException('Name in use')
        }

        const user = new this.profileModel({
            uid: TelegramUtil.idByTelegram(profile.telegramChannelId),
            name: profile.name,
            role: profile.role,
            telegramChannelId: profile.telegramChannelId,
            registerMode: 'TELEGRAM',
            created: new Date(),
            modified: new Date(),
        })

        await user.save()
        this.logger.log(`Created user ${user.name}, uid: ${user.uid}`)
    }




    public async deleteByTelegram(profile: Profile) {
        const deleted = await this.profileModel.deleteOne({
            uid: profile.uid
        })
        if (!deleted.deletedCount) {
            throw new Error(`Not found user with uid: ${profile.uid}`)
        }
    }
}
