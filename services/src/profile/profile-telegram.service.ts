import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './model/profile.model';
import { Model } from 'mongoose';
import { TelegramUtil } from '../telegram/util/telegram.util';
import { AppJwtService } from './auth/app-jwt.service';
import { ProfileService } from './profile.service';
import { Subject } from 'rxjs';
import { BotUtil } from '../telegram/util/bot.util';

export interface LoginToken {
    telegramChannelId: string
    token: string
    expiration: Date
    pin: string
}

export interface TelegramMessage {
    message: string
    telegramChannelId: string
}

@Injectable()
export class ProfileTelegramService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
        private readonly jwtService: AppJwtService,
        private readonly profileService: ProfileService,
        // private readonly telegramService: TelegramService,
    ) {}

    private sendMessageSubject$ = new Subject<TelegramMessage>()
    public get sendMessageObs$() {
        return this.sendMessageSubject$.asObservable()
    } 

    private cleanMessagesSubject$ = new Subject<string>()
    public get cleanMessages$() {
        return this.cleanMessagesSubject$.asObservable()
    } 

    public sendMessage(msg: TelegramMessage) {
        this.sendMessageSubject$.next(msg)
    }

    private loginTokens: LoginToken[] = []

    public findByTelegram(telegramChannelId: string) {
        return this.profileModel.findOne({ telegramChannelId })
    }

    public findByName(name: string) {
        return this.profileModel.findOne({ name })
    }

    async telegramPinRequest(uidOrNameOrEmail: string): Promise<{ token: string }> {
        this.logger.log(`Telegram PIN request with argument uidOrNameOrEmail: ${uidOrNameOrEmail}`)
        let profile = await this.profileModel.findOne({ uid: uidOrNameOrEmail }, { telegramChannelId: true })
        if (!profile) {
            profile = await this.profileModel.findOne({ name: uidOrNameOrEmail }, { telegramChannelId: true } )
            if (!profile) {

                // TODO
                profile = await this.profileModel.findOne({ email: uidOrNameOrEmail }, { telegramChannelId: true } )
                if (!profile) {
                    throw new NotFoundException(`Not found matched profile`)
                }
            }
        }
        const token = await this.generateLoginToken(profile.telegramChannelId)

        this.sendMessage({
            telegramChannelId: profile.telegramChannelId,
            message: BotUtil.msgFrom([
                `You login PIN: ${token.pin}`,
                `It's valid for 60 seconds`
            ])
        })
        return { token: token.token }
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

        this.cleanMessagesSubject$.next(token.telegramChannelId)
        return { token: this.jwtService.signIn(profile) }
    }


    async generateLoginToken(telegramChannelId: string): Promise<LoginToken> {
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
        if (!profile.telegramChannelId) {
            throw new BadRequestException('Missing telegram channel id')
        }
        
        const checkTelegram = await this.profileModel.findOne({ 
            telegramChannelId: profile.telegramChannelId
        })
        if (checkTelegram) {
            throw new BadRequestException('Name in use')
        }

        profile.uid = TelegramUtil.idByTelegram(profile.telegramChannelId)

        await this.profileService.createProfile(profile, 'TELEGRAM')
    }


    public async deleteByTelegram(profile: Profile) {
        const deleted = await this.profileModel.deleteOne({
            uid: profile.uid
        })
        if (!deleted.deletedCount) {
            throw new Error(`Not found user with uid: ${profile.uid}`)
        }

        this.cleanMessagesSubject$.next(profile.telegramChannelId)
    }
}
