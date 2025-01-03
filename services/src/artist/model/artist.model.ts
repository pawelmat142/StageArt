import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export const artistMediaCodes = [
    '', 
    'facebook', 
    'instagram', 
    'soundcloud', 
    'bandcamp',
    'spotify',
    'you_tube',
    'website'
] as const

export type ArtistMediaCode = typeof artistMediaCodes[number]

export interface Chip {
    name: string
    id: string
}

export interface SelectorItem {
    name: string
    code: string
    imgUrl?: string
    svg?: ArtistMediaCode
}

export interface ArtistStyle extends Chip {}

export interface ArtistLabel extends Chip {}

export interface Country extends SelectorItem {}

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
    bgMobile?: FireImg

    avatar?: FireImg
    avatarMobile?: FireImg
    mini?: FireImg
}

export interface Images {
    avatar?: FireImgSet
    bg?: FireImgSet[]
}


export type ArtistDocument = HydratedDocument<Artist>

//status READY when all mandatory view fields are filled, 
//status ACTIVE when manager accepts an Artist -> artist view is published
//status INACTIVE when manager or artist deactivate account -> artist view is not published anymore
export type ArtistStatus = 'CREATED' | 'READY' | 'ACTIVE' | 'INACTIVE'

@Schema()
export class Artist {

    @Prop({ required: true })
    signature: string

    @Prop({ required: true })
    managerUid?: string

    @Prop({ required: true })
    status: ArtistStatus


    @Prop({ required: true })
    name: string
    
    @Prop({ type: Object })
    country: Country

    @Prop()
    styles: ArtistStyle[]
    
    @Prop()
    labels: ArtistLabel[]



    @Prop()
    firstName: string
    
    @Prop()
    lastName: string
    
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
    managmentNotes: string
    
    
    @Prop()
    created: Date
    
    @Prop()
    modified: Date
}

export const ArtistSchema = SchemaFactory.createForClass(Artist)