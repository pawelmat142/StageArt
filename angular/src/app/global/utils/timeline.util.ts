import { FormControl } from "@angular/forms";
import { pFormControl } from "../../form-processor/form-processor.service";
import { TimelineItem } from "../../booking/services/artist-timeline.service";

export abstract class TimelineUtil {

    public static getDisabledDates(items: TimelineItem[]): Date[] {
        return this.collectUniqueDates(items)
    }

    public static tommorow(): Date {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        return tomorrow
    }

    private static collectUniqueDates(timelineItems: TimelineItem[]): Date[] {
        const uniqueDates = new Set<number>(); // Store dates as timestamps to avoid duplicates

        // Helper function to add all dates between a start and end date
        const addDatesBetween = (start: Date, end: Date) => {
            const currentDate = new Date(start);
            while (currentDate <= end) {
                uniqueDates.add(currentDate.getTime()); // Store timestamps to ensure uniqueness
                currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
            }
        };

        // Iterate through each timeline item and collect dates
        for (const item of timelineItems) {
            const performanceStartDate = new Date(item.startDate)
            const endDate = item.endDate
            const performanceEndDate = endDate && new Date(endDate)
            // Ensure that we are not working with undefined or invalid dates
            if (performanceStartDate && !isNaN(performanceStartDate.getTime())) {
                // Always include the start date, if not already included
                uniqueDates.add(performanceStartDate.getTime());

                // If performanceEndDate is defined, add all dates between start and end date
                if (performanceEndDate && !isNaN(performanceEndDate.getTime())) {
                    addDatesBetween(performanceStartDate, performanceEndDate);
                }
            }
        }

        // Convert timestamps back to Date objects and return sorted unique dates
        return Array.from(uniqueDates)
            .map(timestamp => new Date(timestamp))
            .sort((a, b) => a.getTime() - b.getTime());
    }

    public static mockDates(uniqueDates: Date[]): Date[] {
        // TODO MOCK!
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)

        const nextWeek1 = new Date()
        nextWeek1.setDate(nextWeek1.getDate() + 8)

        const nextWeek2 = new Date()
        nextWeek2.setDate(nextWeek2.getDate() + 9)

        const nextWeek3 = new Date()
        nextWeek3.setDate(nextWeek3.getDate() + 10)

        uniqueDates.push(nextWeek)
        uniqueDates.push(nextWeek1)
        uniqueDates.push(nextWeek2)
        uniqueDates.push(nextWeek3)
        return uniqueDates
    }

    public static prepareFormControl(control: pFormControl): FormControl {
        if (!control.type || ['text', 'textarea'].includes(control.type)) {
          return new FormControl('', control.validators)
        }
        if (control.type === 'date') {
          return new FormControl<Date | null>(null, control.validators)
        }
        if (control.type === 'selector') {
          return new FormControl<any>(null, control.validators)
        }
        throw new Error(`Unknown control type: ${control.type}`)
      }


    public static toCamelCase(str: string): string {
        return str
            .toLowerCase()
            .split(' ')
            .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }
}