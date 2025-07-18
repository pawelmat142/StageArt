import { SelectorItem } from '../../artist/artist.controller';
import { DateUtil } from '../../global/utils/date.util';

export const getBookForm = (
  artist: SelectorItem,
  promoterInformation: any,
  eventInformation: any,
) => {
  const date = eventInformation?.performanceStartDate
    ? new Date(eventInformation.performanceStartDate)
    : new Date();
  return {
    eventInformation,
    promoterInformation,
    artistInformation: {
      artist: artist,
      offer: '5000',
      travel: 'We will book fly to nearby airport',
      accommodation: 'Nearby hotel will be organised',
      groundTransport: 'We have drivers',
      visa: 'not needed',
      detailsOfMediaRecordingRequests: '',
    },
    performanceDetails: {
      stageRoom: 'main',
      proposedSetTime: '21:00',
      runningOrder: '3 or 4',
      doors: 'main',
      curfew: '-',
      exclusivityRadiusIssues: '-',
      offerExpiryDate: DateUtil.addMonths(date, -3),
    },
  };
};
