import { Event } from "../../event/model/event.model";
import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { Role } from "../../profile/model/role";
import { Booking, StatusHistory } from "../model/booking.model";

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
        const date = event.startDate
        date.setMonth(event.startDate.getMonth() - 2)
        return date
    }

    public static feeDeadline(event: Event): Date {
        const date = event.startDate
        date.setMonth(event.startDate.getMonth() - 1)
        return date
    }

}