import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../../profile/auth/jwt-strategy';
import { Booking } from '../model/booking.model';

export abstract class BookingAccessUtil {
  public static canCancelBooking(
    booking: Booking,
    profile: JwtPayload,
  ): boolean {
    if (['SUBMITTED', 'DOCUMENTS'].includes(booking.status)) {
      if ([booking.promoterUid, booking.managerUid].includes(profile.uid)) {
        return true;
      }
    }
    new Logger(this.constructor.name).error(
      `Trying to cancel booking with status ${booking.status} by ${
        profile.uid
      }, role: ${profile.roles.join(', ')}`,
    );
    throw new UnauthorizedException();
  }

  public static canRequestBookingDocuments(
    booking: Booking,
    profile: JwtPayload,
  ): boolean {
    if (['SUBMITTED'].includes(booking.status)) {
      if ([booking.managerUid].includes(profile.uid)) {
        return true;
      }
    }
    new Logger(this.constructor.name).error(
      `Trying to request documents for booking with status ${
        booking.status
      } by ${profile.uid}, role: ${profile.roles.join(', ')}`,
    );
    throw new UnauthorizedException();
  }
}
