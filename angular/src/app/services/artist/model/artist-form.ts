import { ArtistMedia } from "../artist-medias/artist-medias.service"

export interface FireImg {
    firePath: string
    url: string
}

export interface ArtistForm {
    signature: string
    name: string
    countryCode: string
    firstName?: string
    lastName?: string
    email: string
    phone: string
    medias?: ArtistMedia[]
    avatar: FireImg
    images: FireImg[]
    bio: string
}
