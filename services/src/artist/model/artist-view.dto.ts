import { Expose } from "class-transformer"
import { ArtistMedia, ArtistStatus, Images, MusicStyle } from "./artist.model"

export class ArtistViewDto {

    @Expose()
    signature: string
    
    @Expose()
    name: string
    
    @Expose()
    status: ArtistStatus
    
    @Expose()
    countryCode: string
    
    @Expose()
    medias?: ArtistMedia[]
    
    @Expose()
    images: Images
    
    @Expose()
    bio: string
    
    @Expose()
    style: MusicStyle[]
    
    @Expose()
    managmentNotes: string
}