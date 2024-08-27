import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';

import { Observable, map } from 'rxjs';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { BookingDto } from '../../booking/model/booking.dto';
import { Event } from '../../event/model/event.model';

interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: ClassConstructor) {}

    options: ClassTransformOptions = {
        excludeExtraneousValues: true
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        //  run something before a request is handled by request handler
        return next.handle().pipe(
            map((data: any) => {
                // run something before response is sent out

                if (Array.isArray(data)) {
                    return data.map((item) => plainToClass(this.dto, item, this.options))
                }

                return plainToClass(this.dto, data, this.options)
            })
        );
    }

}

export class SerializeBookingDto implements NestInterceptor {

    options: ClassTransformOptions = {
        excludeExtraneousValues: true
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data: BookingDto | BookingDto[]) => {
                if (Array.isArray(data)) {
                    return data.map((item) => this.serializeBooking(item))
                }
                return this.serializeBooking(data)
            })
        );
    }

    private serializeBooking(data: BookingDto): BookingDto {
        if (data.event) {
            data.event = plainToClass(Event, data.event, this.options)
        }
        return plainToClass(BookingDto, data, this.options)
    }
}
