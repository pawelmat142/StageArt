import { Expose } from "class-transformer"
import { ArtistMedia, Images } from "./artist.model"

export class ArtistViewDto {

    @Expose()
    signature: string
    
    @Expose()
    name: string
    
    @Expose()
    countryCode: string
    
    @Expose()
    medias?: ArtistMedia[]
    
    @Expose()
    images: Images
    
    @Expose()
    bio: string

}