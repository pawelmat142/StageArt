import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { Booking, BookingStatus, StatusHistory } from "../model/booking.model";

export abstract class BookingUtil {

    public static addStatusToHistory(booking: Booking, profile: JwtPayload) {
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
}