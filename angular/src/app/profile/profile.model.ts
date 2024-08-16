
export interface ProfileDto {
    uid: string
    name: string
    role: Role
    telegramChannelId?: string
}

export type Role = 'MANAGER' | 'PROMOTER' | 'ARTIST' | 'ADMIN'

export interface Profile { // JwtPayload
    uid: string
    name: string
    telegramChannelId: string
    role: Role
    exp: number
    iat: number
    artistSignature?: string
}