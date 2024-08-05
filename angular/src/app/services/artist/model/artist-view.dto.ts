import { ArtistMedia } from "../artist-medias/artist-medias.service"
import { Images } from "./artist-form"

export interface ArtistViewDto {

    signature: string
    
    name: string
    
    countryCode: string
    
    medias?: ArtistMedia[]
    
    images: Images
    
    bio: string

}