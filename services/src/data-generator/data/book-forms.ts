import { SelectorItem } from "../../artist/artist.controller";
import { Country } from "../../artist/model/artist.model";
import { DateUtil } from "../../global/utils/date.util";

export const getBookForm = (
    name: string, 
    eventCountry: Country,
    artist: SelectorItem,
    promoterInformation: any,
    start: Date, 
    end?: Date,
) =>  {
    return {
        eventInformation: {
          performanceStartDate: start,
          performanceEndDate: end,
          eventName: name,
          eventCountry: eventCountry,
          venueName: "Piazza della Musica",
          venueAddress: "45, 20121 Milan",
          nearestAirport: "Milan Malpensa Airport",
          website: "www.electricpulsefestival.it",
          venueCapacity: "12000",
          ticketPrice: "120 euro",
          ageRestriction: "18",
          recentArtistsPerformedInVenue: "",
          videoLinkToRecentShow: "https://www.youtube.com/watch?v=TfZJaQQ9UYE"
        },
        promoterInformation,
        artistInformation: {
          artist: artist,
          offer: "5000",
          travel: "We will book fly to nearby airport",
          accommodation: "Nearby hotel will be organised",
          groundTransport: "We have drivers",
          visa: "not needed",
          detailsOfMediaRecordingRequests: ""
        },
        performanceDetails: {
          stageRoom: "main",
          proposedSetTime: "21:00",
          runningOrder: "3 or 4",
          doors: "main",
          curfew: "-",
          exclusivityRadiusIssues: "-",
          offerExpiryDate: DateUtil.addMonths(start, -3)
        },
      }
    }