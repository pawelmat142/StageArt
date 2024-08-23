
export interface ProfileDto {
    uid: string
    name: string
    roles: string[]
    telegramChannelId?: string
}

export interface Profile { 
    uid: string
    name: string
    roles: string[]
    artistSignature?: string
    telegramChannelId?: string
    phoneNumber?: string
    contactEmail?: string
    email?: string
    firstName?: string
    lastName?: string
    promotorInfo?: any
}

export abstract class Role {

    public static readonly ADMIN = 'ADMIN'

    public static readonly ARTIST = 'ARTIST'
    public static readonly MANAGER = 'MANAGER'
    public static readonly PROMOTOR = 'PROMOTOR'

    public static matches(profile?: Profile, rolesGuard?: string[]): boolean {
        if (!profile) {
            return false
        }
        if (!rolesGuard) {
            return true
        }
        return profile.roles.some(profileRole => rolesGuard?.includes(profileRole))
    }
}