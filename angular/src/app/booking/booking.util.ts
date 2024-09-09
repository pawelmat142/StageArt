import { BookingDto } from "./services/booking.service"

export abstract class BookingUtil {

    public static submitDate(booking: BookingDto): Date | undefined {
        return booking.statusHistory.find(h => h.status === 'SUBMITTED')?.date
    }

    public static artistNames(booking: BookingDto): string[] {
        return booking.artists.map(a => a.name)
    }

    public static artistSignatures(booking: BookingDto): string[] {
        return booking.artists.map(a => a.code)
    }
}