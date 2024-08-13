import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type ProfileDocument = HydratedDocument<Profile>

export type Role = 'MANAGER' | 'PROMOTER' | 'ARTIST' | 'ADMIN'

export type RegisterMode = 'TELEGRAM' | 'EMAIL'

@Schema()
export class Profile {
    
    @Prop({ required: true })
    uid: string
    
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    role: Role


    @Prop()
    registerMode: RegisterMode

    @Prop()
    telegramChannelId?: string

    @Prop()
    email?: string

    @Prop()
    passwordHash?: string


    
    @Prop()
    created: Date
    
    @Prop()
    modified: Date
    

    @Prop({ type: Object })
    promoterInfo?: any
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)


