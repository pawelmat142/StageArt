import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"


export type EventDocument = HydratedDocument<Event>

export type EventStatus = 'CREATED' | 'ACTIVE' | 'INACTIVE'

@Schema()
export class Event {

    @Prop({ required: true })
    signature: string

    @Prop({ required: true })
    promoterUid: string

    @Prop({ required: true })
    status: EventStatus



    @Prop()
    name: string
    
    @Prop()
    startDate: Date
    
    @Prop()
    endDate?: Date
    
    
    @Prop({ type: Object })
    formData: any


    @Prop()
    created: Date
    
    @Prop()
    modified: Date
}

export const EventSchema = SchemaFactory.createForClass(Event)