import { Expose } from "class-transformer";
import { BookingStatus, StatusHistory } from "./booking.model";
import { SelectorItem } from "../../artist/model/artist.model";
import { Event } from "../../event/model/event.model";

export class BookingDto {

    @Expose()
    formId: string
    
    @Expose()
    promoterUid: string
    
    @Expose()
    managerUid: string
    
    
    @Expose()
    status: BookingStatus
    
    
    @Expose()
    artists: SelectorItem[]
   

    @Expose()
    eventSignature: string
    
    @Expose()
    statusHistory: StatusHistory[]
    
    @Expose()
    event?: Event
}