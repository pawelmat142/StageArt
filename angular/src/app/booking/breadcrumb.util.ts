import { MenuItem } from "primeng/api";
import { BookingDto } from "./services/booking.service";
import { Store } from "@ngrx/store";
import { unselectBooking } from "../profile/profile.state";

export abstract class BreadcrumbUtil {

    public static bookings(): MenuItem[] {
        return [{
            label: 'Bookings'
        }]
    }

    public static booking(store: Store, booking?: BookingDto): MenuItem[] {
        const result: MenuItem[] = [{
            label: `Bookings`,
            command: () => store.dispatch(unselectBooking())
        }]
        if (booking) {
            const name = booking.formData?.eventInformation.eventName || booking.event.name
            result.push({
                label: `${name}`,
            })
        }
        return result
    }
}