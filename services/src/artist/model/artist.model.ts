import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export interface ArtistMedia {
    code: string,
    url: string
}

export interface FireImg {
    firePath: string
    url: string
}


export type DiscountDocument = HydratedDocument<Artist>

@Schema()
export class Artist {

    @Prop({ required: true })
    signature: string

    @Prop({ required: true })
    name: string
    
    @Prop({ required: true })
    active: boolean
    
    @Prop()
    countryCode: string
    
    @Prop()
    firstName?: string
    
    @Prop()
    lastName?: string
    
    @Prop()
    email: string
    
    @Prop()
    phone: string
    
    @Prop()
    medias?: ArtistMedia[]
    
    @Prop({ type: Object })
    avatar: FireImg
    
    @Prop({ type: Object })
    images: FireImg[]
    
    @Prop()
    bio: string

}

export const ArtistSchema = SchemaFactory.createForClass(Artist)