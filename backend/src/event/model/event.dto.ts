import { Expose } from 'class-transformer';
import { EventStatus } from './event.model';

export class EventPanelDto {
  @Expose()
  signature: string;
  @Expose()
  promoterUid: string;
  @Expose()
  status: EventStatus;
  @Expose()
  name: string;
  @Expose()
  startDate: Date;
  @Expose()
  endDate?: Date;
}
