
export interface ProfileDto {
    uid: string
    name: string
    role: Role
    telegramChannelId?: string
}

export type Role = 'MANAGER' | 'PROMOTER' | 'ARTIST' | 'ADMIN'

export interface Profile { 
    uid: string
    name: string
    role: Role
    artistSignature?: string
    telegramChannelId?: string
    phoneNumber?: string
    contactEmail?: string
    email?: string
    firstName?: string
    lastName?: string
    promoterInfo?: any
}