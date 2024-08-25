import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Expose } from "class-transformer"
import { HydratedDocument } from "mongoose"

export type BookingDocument = HydratedDocument<Booking>

export type BookingStatus = 'SUBMITTED' | 'DOCUMENTS_REQUESTED' | 'PENDING' | 'READY' | 'CANCELED'

export interface StatusHistory {
    version: number
    status: BookingStatus
    date: Date
    uid: string
    role: string
    info?: string
}

@Schema()
export class Booking {

    @Prop()
    @Expose()
    formId: string
    
    @Prop({ required: true })
    @Expose()
    promoterUid: string
    
    @Prop({ required: true })
    @Expose()
    managerUid: string
    
    
    @Prop({ required: true })
    @Expose()
    status: BookingStatus
    
    @Prop()
    @Expose()
    submitDate?: Date
    
    
    @Prop({ required: true })
    @Expose()
    artistSignatures: string[]
   
    @Prop({ required: true })
    @Expose()
    eventSignature: string

    @Prop({ type: Object })
    @Expose()
    formData?: any


    @Prop({ type: Object })
    statusHistory: StatusHistory[]

    @Prop()
    created: Date
    
    @Prop()
    modified: Date
}

export const BookingSchema = SchemaFactory.createForClass(Booking)
