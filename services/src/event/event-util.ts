import { BotUtil } from "../telegram/util/bot.util";
import { Event } from "./model/event.model";

export abstract class EventUtil {

    public static dateString(event: Event): string {
        if (event.endDate) {
            return `${BotUtil.formatDate(event.startDate)} - ${BotUtil.formatDate(event.endDate)}`
        }
        return BotUtil.formatDate(event.startDate)
    }
}