import { ArtistMedia } from "../artist-medias/artist-medias.service"

export interface FireImg {
    firePath: string
    url: string
}

export interface AvatarRef {
    url: string;
    publicId: string;
}

export interface FireImgSet {
    name: string
    bg?: AvatarRef
    bgMobile?: AvatarRef

    avatar?: AvatarRef
    avatarMobile?: AvatarRef
    mini?: AvatarRef
}

export interface Images {
    avatar?: FireImgSet
    bg?: FireImgSet[]
}

export interface ArtistForm {
    signature: string
    name: string
    country: string
    firstName?: string
    lastName?: string
    email: string
    phone: string
    medias?: ArtistMedia[]

    images: Images

    bio: string
}
