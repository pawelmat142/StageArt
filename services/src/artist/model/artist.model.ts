import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { Booking } from "../../booking/model/booking.model"

export interface ArtistMedia {
    code: string,
    url: string
}

export interface FireImg {
    firePath: string
    url: string
}

export interface FireImgSet {
    name: string
    bg?: FireImg
    miniBg?: FireImg

    avatar?: FireImg
    mini?: FireImg
}

export interface Images {
    avatar?: FireImgSet
    bg?: FireImgSet[]
}


export type DiscountDocument = HydratedDocument<Artist>

export type ArtistStatus = 'CREATED' | 'READY' | 'ACTIVE'

export interface MusicStyle {
    order: number
    id: string
    name: string
}

@Schema()
export class Artist {

    @Prop({ required: true })
    signature: string

    @Prop({ required: true })
    name: string
    
    @Prop({ required: true })
    managerUid?: string

    @Prop({ required: true })
    status: ArtistStatus
    
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
    images: Images

    @Prop()
    bio: string

    @Prop()
    style: MusicStyle[]

    @Prop()
    managmentNotes: string
    
    @Prop()
    bookings?: Partial<Booking>[]

}

export const ArtistSchema = SchemaFactory.createForClass(Artist)