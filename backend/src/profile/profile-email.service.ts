import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AppJwtService } from "./auth/app-jwt.service";
import { InjectModel } from "@nestjs/mongoose";
import { Profile } from "./model/profile.model";
import { Model } from "mongoose";
import { randomBytes } from "crypto";
import { scrypt as _scrypt }  from 'crypto';
import { promisify } from "util";
import { ProfileService } from "./profile.service";
import { SelectorItem } from "../artist/artist.controller";
import { Util } from "../global/utils/util";
import { MessageException } from "../global/exceptions/message-exception";
const scrypt = promisify(_scrypt);

export interface LoginForm {
    name: string
    role: SelectorItem
    email: string
    password: string
}

@Injectable()
export class ProfileEmailService {

    private readonly logger = new Logger(this.constructor.name)

    private readonly HASH_CONSTANT: number = 32;


    constructor(
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
        private readonly jwtService: AppJwtService,
        private readonly profileService: ProfileService,
    ) {}

    public async createProfile(form: LoginForm) {
        if (!form.name) {
            throw new MessageException('Missing name')
        }
        if (!form.email) {
            throw new MessageException('Missing email')
        }
        const checkEmail = await this.profileModel.findOne({
            email: form.email
        }).select('_id')
        if (checkEmail) {
            throw new MessageException('Email already in use')
        }
        if (!form.password) {
            throw new MessageException('Missing password')
        }
        if (!form.role) {
            throw new MessageException('Missing role')
        }

        const profile = new this.profileModel(form)
        profile.roles = [form.role.code]

        const salt = randomBytes(8).toString('hex')
        const hash = await scrypt(form.password, salt, this.HASH_CONSTANT) as Buffer
        const hashPassword = salt + '.' + hash.toString('hex')

        profile.passwordHash = hashPassword
        profile.uid = this.emailUid(profile.name)

        return this.profileService.createProfile(profile, 'EMAIL')
    }

    public async loginByEmail(form: Partial<LoginForm>) {
        if (!form.email) {
            throw new MessageException('Missing email')
        }
        const profile = await this.profileModel.findOne({ email: form.email })
        if (!profile) {
            throw new MessageException("Wrong credentials")
        }

        const [salt, storedHash] = profile.passwordHash.split('.')
        const hash = (await scrypt(form.password, salt, 32)) as Buffer
        if (storedHash !== hash.toString('hex')) throw new MessageException("Wrong credentials")
        
        const token = this.jwtService.signIn(profile)
        this.logger.log(`Logged in profile ${profile.name}`)
        
        return { token: token }
    }

    private emailUid(name: string): string {
        return `email_${Util.toKebabCase(name)}`
    }

}