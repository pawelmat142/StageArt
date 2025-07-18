import { Expose } from 'class-transformer';

export class ProfileDto {
  @Expose()
  uid: string;

  @Expose()
  name: string;

  @Expose()
  roles: string[];

  @Expose()
  telegramChannelId?: string;
}
