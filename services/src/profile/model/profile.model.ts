import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Expose } from "class-transformer"
import { HydratedDocument } from "mongoose"

export type ProfileDocument = HydratedDocument<Profile>

export type RegisterMode = 'TELEGRAM' | 'EMAIL'

@Schema()
export class Profile {
    
    @Expose()
    @Prop({ required: true })
    uid: string
    
    @Expose()
    @Prop({ required: true })
    name: string
    
    @Expose()
    @Prop({ required: true })
    roles: string[]
    
    @Expose()
    @Prop()
    artistSignature?: string
    
    
    @Prop()
    registerMode: RegisterMode
    
    @Prop()
    @Expose()
    telegramChannelId?: string
    
    @Prop()
    @Expose()
    phoneNumber?: string
    
    @Prop()
    @Expose()
    contactEmail?: string
    
    
    @Prop()
    @Expose()
    email?: string
    
    @Prop()
    passwordHash?: string
    
    
    @Prop()
    @Expose()
    firstName?: string
    
    @Prop()
    @Expose()
    lastName?: string
    
    
    @Prop()
    created: Date
    
    @Prop()
    modified: Date
    

    @Prop({ type: Object })
    @Expose()
    promotorInfo?: any
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)


