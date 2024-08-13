import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type BookingDocument = HydratedDocument<Booking>

export type BookingStatus = 'SUBMITTED' | 'PENDING' | 'READY' | 'CANCELED'


@Schema()
export class Booking {

    @Prop()
    formId: string

    @Prop({ required: true })
    promoterUid: string
    
    @Prop({ required: true })
    managerUid: string
    
    @Prop({ required: true })
    artistSignatures: string[]

    @Prop({ required: true })
    status: BookingStatus


    @Prop({ required: true })
    startDate: Date
    
    @Prop()
    endDate?: Date


    @Prop({ type: Object })
    formData?: any
}

export const BookingSchema = SchemaFactory.createForClass(Booking)
