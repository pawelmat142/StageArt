import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Expose } from "class-transformer"
import { HydratedDocument } from "mongoose"
import { Template } from "./paper-util"

export type PaperDocument = HydratedDocument<Paper>

export type PaperStatus = 'GENERATED' | 'SIGNED' | 'VERIFIED' | 'ERROR'

@Schema()
export class Paper {

    @Expose()
    @Prop({ required: true })
    id: string

    @Expose()
    @Prop()
    formId: string

    @Expose()
    @Prop({ required: true })
    template: Template
    
    @Prop({ required: true })
    content: Buffer
    
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
}

export const PaperSchema = SchemaFactory.createForClass(Paper)