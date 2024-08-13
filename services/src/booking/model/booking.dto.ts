import { Expose } from "class-transformer";
import { BookingStatus } from "./booking.model";

export class BookingListDto {
    @Expose() formId: string
    @Expose() promoterUid: string
    @Expose() managerUid: string
    @Expose() status: BookingStatus
    @Expose() startDate: Date
    @Expose() endDate?: Date
    @Expose() submitDate?: Date
    @Expose() eventName: string
    @Expose() artistNames: string[]
}