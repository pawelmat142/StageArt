import { ArtistMedia } from "../artist-medias/artist-medias.service"
import { FireImg } from "./artist-form"

export interface ArtistViewDto {

    signature: string
    
    name: string
    
    countryCode: string
    
    medias?: ArtistMedia[]
    
    avatar: FireImg
    
    images: FireImg[]
    
    bio: string

}