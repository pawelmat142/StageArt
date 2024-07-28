    import { ArtistMedia } from "../artist-medias/artist-medias.service"

export interface ArtistForm {
    signature: string
    name: string
    countryCode: string
    firstName?: string
    lastName?: string
    email: string
    phone: string
    medias?: ArtistMedia[]
    avatarUrl: string
    imageUrls: string[]
    bio: string
}
