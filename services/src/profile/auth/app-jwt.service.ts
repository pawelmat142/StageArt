import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from "./jwt-strategy";
import { Profile } from "../model/profile.model";

@Injectable()
export class AppJwtService extends JwtService {
    
    public signIn(user: Profile): string {
        const secret = process.env.JWT_SECRET
        const payload = this.createPayload(user)
        return super.sign(payload, { secret })
    }

    public newToken(payload: JwtPayload): string {
        const secret = process.env.JWT_SECRET
        payload.iat = Date.now()
        payload.exp = this.getExpirationTimestamp()
        return super.sign(payload, { secret })
    }

    public extractToken(request: any): string {
        const headers: string[] = request.rawHeaders || []
        const index = headers.findIndex((header: string) => header.toLowerCase() === 'authorization')
        if (index === -1) return ''
        const [prefix, token] = headers[index + 1].split(' ')
        if (prefix !== 'Bearer') return ''
        return token
    }

    public getPayload(token: string): JwtPayload {
        return jwt.decode(token) as JwtPayload
    }

    public isExpired(payload: JwtPayload): boolean {
        return Date.now() >= payload.exp
    }

    public createPayload(profile: Profile): JwtPayload { //Profile
        return {
            uid: profile.uid,
            role: profile.role,
            name: profile.name,
            telegramChannelId: profile.telegramChannelId,
            exp: this.getExpirationTimestamp(),
            iat: Date.now()
        }
    }

    private getExpirationTimestamp(): number {
        const now = new Date()
        return now.setDate(now.getDate() + 2).valueOf()
    }

}