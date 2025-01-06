import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export interface JwtPayload {
    uid: string
    name: string
    telegramChannelId: string
    roles: string[]
    exp: number
    iat: number
    artistSignature?: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
    ) {
        const secret = process.env.JWT_SECRET
        super({
            secret: secret,
            secretOrKey: secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

}