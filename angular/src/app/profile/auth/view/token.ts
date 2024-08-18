import * as decode from "jwt-decode";
import moment from "moment";
import { Role } from "../../profile.model";

export interface JwtPayload {
    uid: string
    name: string
    telegramChannelId: string
    roles: string[]
    exp: number
    iat: number
    artistSignature?: string
}

export abstract class Token {

    private static readonly TOKEN = 'token'
    private static readonly UID = 'uid'

    public static set(token: string) {
        localStorage.setItem(this.TOKEN, token)
        this.setUid()
    }

    public static getUid(): string {
        return localStorage.getItem(this.UID) || ''
    }
    
    private static setUid() {
        const uid = this.payload?.uid
        if (uid) {
            localStorage.setItem(this.UID, uid)
        }
    }

    public static remove() {
        localStorage.removeItem(this.TOKEN);
    }

    public static get token(): string | null {
        return localStorage.getItem(this.TOKEN)
    }

    public static get tokenHeader(): string {
        const token = this.token
        if (!token) throw new Error("Not logged in")
        return `Bearer ${token}`
    }

    public static get payload(): JwtPayload | null {
        const _token = this.token
        return _token ? decode.jwtDecode(_token) as JwtPayload : null
    }

    public static get loggedIn(): boolean {
        const payload = this.payload
        if (!payload || !payload.exp) {
            return false
        }
        return this.logged(payload)
    }

    public static get admin(): boolean {
        const payload = this.payload
        if (!payload || !payload.roles || !payload.exp) {
            return false
        }
        const aminRole = payload.roles.includes(Role.ADMIN)
        const notExpired = this.logged(payload)
        return aminRole && notExpired
    }

    private static logged(payload: JwtPayload): boolean {
        return moment().isBefore(payload.exp)
    }

}