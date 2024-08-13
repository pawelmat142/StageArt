import { BadRequestException, Logger } from "@nestjs/common"

export interface DatePeriod {
    startDate: Date
    endDate?: Date
}

export abstract class BookingFormProcessor {

    public static findArtistSignatures(bookingFormData: any) {
        const artists = bookingFormData.artists
        if (Array.isArray(artists)) {
            return artists.map((a) => a.artist).filter(signature => !!signature)
        }
        return null
    }
    
    public static findEventDates(bookingFormData: any) {
        const eventInformation = bookingFormData['eventInformation']
        if (!eventInformation) {
            throw new BadRequestException("Missing eventInformation")
        }
        const start = eventInformation['performanceStartDate']
        const end = eventInformation['performanceEndDate']
        if (start) {
            const startDate = new Date(start)
            if (startDate instanceof Date) {
                const result: DatePeriod = { startDate }
                if (end) {
                    const endDate = new Date(end)
                    if (endDate instanceof Date) {
                        result.endDate = endDate
                    }
                }
                return result
            }
        }
    }


}