import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Expose } from "class-transformer"
import { ArtistMedia, FireImg } from "./artist.model"

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
    avatar: FireImg
    
    @Expose()
    images: FireImg[]
    
    @Expose()
    bio: string

}