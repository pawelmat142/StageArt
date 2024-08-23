import { Expose } from "class-transformer";
import { BookingStatus } from "./booking.model";

export class BookingPanelDto {

    @Expose()
    formId: string

    @Expose() promotorUid: string
    @Expose() managerUid: string
    @Expose() status: BookingStatus
    @Expose() submitDate?: Date

    @Expose() artistSignatures: string[]
    @Expose() artistNames: string[]

    @Expose() eventName: string
    @Expose() eventStartDate: Date
    @Expose() eventEndDate?: Date
}