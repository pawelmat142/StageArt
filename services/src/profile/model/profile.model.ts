import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type ProfileDocument = HydratedDocument<Profile>

export type Role = 'MANAGER' | 'PROMOTER' | 'ARTIST' | 'ADMIN'

export type RegisterMode = 'TELEGRAM'

@Schema()
export class Profile {
    
    @Prop({ required: true })
    uid: string
    
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    role: Role

    @Prop()
    telegramChannelId?: string

    @Prop()
    registerMode: RegisterMode
    
    @Prop()
    created: Date
    
    @Prop()
    modified: Date
    
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)


