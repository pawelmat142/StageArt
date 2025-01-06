import { environment } from "../../../environments/environment";

export abstract class DateUtil {

    public static sameDay(date1: Date, date2: Date): boolean {
        if (!date1 || !date2) {
            return false
        }
        return date1.getDay() === date2.getDay()
            && date1.getMonth() === date2.getMonth()
            && date1.getFullYear() === date2.getFullYear()

    }

}