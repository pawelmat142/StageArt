import { Event } from "../../event/model/event.model";
import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { Role } from "../../profile/model/role";
import { Booking, StatusHistory } from "../model/booking.model";
import { TimelineItem } from "../services/artist-timeline.service";

export abstract class BookingUtil {

    public static bookingRoles(booking: Booking, profileUid: string): string[] {
        let result = []
        if (booking.promoterUid === profileUid) {
            result.push(Role.PROMOTER)
        }
        if (booking.managerUid === profileUid) {
            result.push(Role.MANAGER)
        }
        if (BookingUtil.artistSignatures(booking).includes(profileUid)) {
            result.push(Role.ARTIST)
        }
        return result
    }

    public static artistSignatures(booking: Booking): string[] {
        return booking.artists.map(a => a.code)
    }

    public static addStatusToHistory(booking: Partial<Booking>, profile: JwtPayload) {
        const newStatus: StatusHistory = {
            status: booking.status,
            uid: profile.uid,
            role: profile.roles.join(','),
            date: new Date(),
            version: booking.statusHistory?.length || 0
        }
        booking.statusHistory = booking.statusHistory || []
        booking.statusHistory.push(newStatus)
    }

    public static depositDeadline(event: Event): Date {
        const date = new Date(event.startDate)
        date.setMonth(event.startDate.getMonth() - 2)
        return date
    }

    public static feeDeadline(event: Event): Date {
        const date = new Date(event.startDate)
        date.setMonth(event.startDate.getMonth() - 1)
        return date
    }

    public static timelineItem(booking: Booking): TimelineItem {
        const result = {
            id: booking.formId,
            status: booking.status,
            eventSignature: booking.eventSignature,
        } as TimelineItem

        const eventInformation = booking.formData.eventInformation
        if (eventInformation) {
            result.startDate = eventInformation.performanceStartDate
            result.endDate = eventInformation.performanceEndDate
            result.countryCode = eventInformation.eventCountry?.code
            result.header = eventInformation.eventName
            result.subheader = eventInformation.venueName
            result.txt = eventInformation?.website
        } 
        return result
    }

}