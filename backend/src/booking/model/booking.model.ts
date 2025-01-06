import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Expose } from "class-transformer"
import { HydratedDocument } from "mongoose"
import { SelectorItem } from "../../artist/model/artist.model"
import { ChecklistItem } from "./checklist.interface"

export type BookingDocument = HydratedDocument<Booking>

export type BookingStatus = 'SUBMITTED' | 'DOCUMENTS' | 'CHECKLIST_COMPLETE' | 'PENDING' | 'READY' | 'CANCELED'

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
    
    
    @Expose()
    @Prop({ type: Object, required: true })
    artists: SelectorItem[]
   

    @Prop({ required: true })
    @Expose()
    eventSignature: string

    @Prop({ type: Object })
    @Expose()
    formData?: any
    
    @Prop({ type: Object, required: true })
    @Expose()
    checklist: ChecklistItem[]

    @Prop({ type: Object })
    statusHistory: StatusHistory[]

    @Prop()
    created: Date
    
    @Prop()
    modified: Date
}

export const BookingSchema = SchemaFactory.createForClass(Booking)
