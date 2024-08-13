import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Role } from "../model/profile.model";

export interface JwtPayload {
    uid: string
    name: string
    telegramChannelId: string
    role: Role
    exp: number
    iat: number
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