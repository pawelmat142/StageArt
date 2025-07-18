import { BadRequestException } from '@nestjs/common';
import { IllegalStateException } from '../../global/exceptions/illegal-state.exception';

export interface DatePeriod {
  startDate: Date;
  endDate?: Date;
}

export abstract class BookingFormProcessor {
  public static findEventInformation(bookingFormData: any) {
    const eventInformation = bookingFormData['eventInformation'];
    if (!eventInformation) {
      throw new IllegalStateException('Missing eventInformation');
    }
    return eventInformation;
  }

  public static findEventDates(bookingFormData: any) {
    const eventInformation = this.findEventInformation(bookingFormData);
    const start = eventInformation['performanceStartDate'];
    const end = eventInformation['performanceEndDate'];
    if (!start) {
      throw new IllegalStateException('Missing event date');
    }
    const startDate = new Date(start);
    if (startDate instanceof Date) {
      const result: DatePeriod = { startDate };
      if (end) {
        const endDate = new Date(end);
        if (endDate instanceof Date) {
          result.endDate = endDate;
        }
      }
      return result;
    }
  }

  public static findEventName(bookingFormData: any): string {
    const eventInformation = this.findEventInformation(bookingFormData);
    if (eventInformation) {
      const eventName = eventInformation['eventName'];
      if (!eventName) {
        throw new IllegalStateException(`Not found event name`);
      }
      return eventName;
    }
  }

  public static findArtistInformation(bookingFormData: any): any {
    const artistInformation = bookingFormData['artistInformation'];
    if (!artistInformation) {
      throw new IllegalStateException('Missing artistInformation');
    }
    return artistInformation;
  }
}
