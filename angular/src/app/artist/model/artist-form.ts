import { ArtistMedia } from "../artist-medias/artist-medias.service"

export interface FireImg {
    firePath: string
    url: string
}

export interface FireImgSet {
    name: string
    bg?: FireImg
    bgMobile?: FireImg

    avatar?: FireImg
    avatarMobile?: FireImg
    mini?: FireImg
}

export interface Images {
    avatar?: FireImgSet
    bg?: FireImgSet[]
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

    images: Images

    bio: string
}
