import { Expose } from "class-transformer"
import { ArtistLabel, ArtistMedia, ArtistStatus, ArtistStyle, Country, Images } from "./artist.model"

export class ArtistViewDto {

    @Expose()
    status: ArtistStatus

    @Expose()
    signature: string

    @Expose()
    name: string
    
    @Expose()
    country: Country

    @Expose()
    styles: ArtistStyle[]
    
    @Expose()
    labels: ArtistLabel[]
    
    @Expose()
    medias?: ArtistMedia[]
    
    @Expose()
    images: Images
    
    @Expose()
    bio: string
    

    
    @Expose()
    managmentNotes: string
}