import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Expose } from "class-transformer"
import { HydratedDocument } from "mongoose"
import { Template } from "./paper-util"
import { Role } from "../profile/model/role"

export type PaperDocument = HydratedDocument<Paper>

export type PaperStatus = 'GENERATED' | 'SIGNED' | 'VERIFIED' | 'ERROR' | 'UPLOADED'

export interface PaperSignature {
    role: Role,
    base64: string
}

@Schema()
export class Paper {

    @Expose()
    @Prop({ required: true })
    id: string

    @Expose()
    @Prop()
    fileObjectId?: string

    @Expose()
    @Prop()
    formId: string

    @Expose()
    @Prop({ required: true })
    template: Template
    
    @Prop()
    content?: Buffer
    
    @Prop()
    contentWithSignatures?: Buffer
    
    @Prop({ required: true })
    @Expose()
    extension: string
    
    @Prop({ required: true })
    uid: string
    
    @Prop({ required: true })
    generationTime: Date
    
    @Expose()
    @Prop({ required: true })
    status: PaperStatus

    @Prop({ type: Object })
    signatures?: PaperSignature[]
}

export const PaperSchema = SchemaFactory.createForClass(Paper)