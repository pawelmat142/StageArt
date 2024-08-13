import * as decode from "jwt-decode";
import moment from "moment";
import { Profile } from "./profile.state";

export type Role = 'MANAGER' | 'PROMOTER' | 'ARTIST' | 'ADMIN'

export interface JwtPayload extends Profile {
    exp: number
    iat: number
}

export abstract class Token {

    private static readonly TOKEN = 'token'

    public static setToken(token: string) {
        localStorage.setItem(this.TOKEN, token)
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
        if (!payload || !payload.role || !payload.exp) {
            return false
        }
        const aminRole = payload.role === 'ADMIN'
        const notExpired = this.logged(payload)
        return aminRole && notExpired
    }

    private static logged(payload: JwtPayload): boolean {
        return moment().isBefore(payload.exp)
    }

}