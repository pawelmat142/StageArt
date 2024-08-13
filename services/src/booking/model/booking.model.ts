import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Expose } from "class-transformer"
import { HydratedDocument } from "mongoose"

export type BookingDocument = HydratedDocument<Booking>

export type BookingStatus = 'SUBMITTED' | 'PENDING' | 'READY' | 'CANCELED'


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
    startDate: Date
    
    @Prop()
    @Expose()
    endDate?: Date
    
    @Prop({ required: true })
    @Expose()
    artistSignatures: string[]
    
    @Prop()
    @Expose()
    artistNames: string[]
    
    @Prop()
    @Expose()
    eventName: string
    
    
    @Prop({ type: Object })
    @Expose()
    formData?: any
}

export const BookingSchema = SchemaFactory.createForClass(Booking)
