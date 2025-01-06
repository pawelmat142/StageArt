import { Util } from "../global/utils/util"
import { Role } from "../profile/profile.model"
import { BookingDto } from "./services/booking.service"

export abstract class BookingUtil {

    public static getName(booking: BookingDto): string {
        const event = booking.formData?.eventInformation
        if (event) {
            const date = event.performanceStartDate ? ` - ${Util.formatDate(event.performanceStartDate)}` : ''
            return `${event.eventName}${date}`
        }
        return booking.formData?.eventInformation?.eventName
    }

    public static submitDate(booking: BookingDto): Date | undefined {
        return booking.statusHistory.find(h => h.status === 'SUBMITTED')?.date
    }

    public static artistNames(booking: BookingDto): string[] {
        return booking.artists.map(a => a.name)
    }

    public static artistSignatures(booking: BookingDto): string[] {
        return booking.artists.map(a => a.code)
    }

    public static bookingRoles(booking: BookingDto, profileUid: string): string[] {
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
}