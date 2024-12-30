import { PdfData } from "./pdf-data";

export const defaultTechRiderPdf: PdfData = {
    data: {
    },
    header: `Tech Rider + Stage pilot + Hospitality`, 
    sections: [
        {
            editable: true,
            items: [{
                paragraph: `This document details the equipment that is required in order for the artist to perform at your event. It is important that all items requested within this document are present and in good working order when he arrives.`
            }, {
                paragraph: `If you have any questions or difficulties for providing the following equipment / hospitality please contact {{data.agencyName}} which will surely work out a solution.`
            }]
        }, 
        {
            editable: true,
            header: `Promotor agrees to provide:`,
            items: [{
                list: [
                    `1 x DJM-900NXS2 mixer updated to the latest firmware`,
                    `2 x Pioneer CDJ3000’s [Preferred] or CDJ2000NXS2’s Fully Linked / Updated`,
                    `1x Stage Riser (approx 90cm high, 300cm long, 100cm deep) or, a sturdy / wobble-free table of the same measure, to fit the instruments and both CDJs and DJ mixer. There must be plentiful lighting around the CDJ’s and suitable table.`,
                    `1x Black drop cloth to fully cover the front and sides of the stage rider / table.`,
                    `Two (2) 15” Format Monitors with Two (2) Double 18” Subwoofers or similar, with Booth Volume Control.`,
                    `1 x Surge-protector power strip with a minimum of four (4) slots.`,
                    `Fans on stage placed to direct air to the DJ area.`,
                    `Four (4) Lightwave Lasers, or similar to add aesthetically pleasing visual production value.`,
                ]
            }, {
                paragraph: `Set up or line-check takes about 15 minutes. Ideal is the artist can be fully set up at least 30 Minutes prior to his stage time.`
            }]
        }, 
        {
            editable: true,
            header: `Sound & Light:`,
            items: [{
                subsection: {
                    header: `Sound:`,
                    items: [{
                        paragraph: `1st class PA System w/minimum 2 full range speakers & 2 sub woofers! The system must be able to produce sufficient loudness and bass response. Sound System must be able to produce sub bass down to 20hz. Please ensure no HPF’s are on above this range, and frequency response is flat from 28- 60hz. The performance shall not occur if proper loudness and tuning is not achievable. We assume that there is a well sized PA system provided for the concert room/ dancehall with sufficient power to supply a clean and undistorted sound and a powerful and feedback proof monitor system.`
                    }]
                }
            }, {
                subsection: {
                    header: `Light:`,
                    items: [{
                        paragraph: `Separate circuit from sound system! Sufficient for venue! One spot-light oriented on the artist and his equipment + moving coloured lights. No smoke machines!`
                    }, {
                        paragraph: `The performance shall not occur in excessively reverberated spaces (churches, warehouses, etc.) Please notify us ahead of time if the performance space is perceivably “echoey.”`
                    }]
                }
            }, {
                subsection: {
                    header: `Staff:`,
                    items: [{
                        paragraph: `A qualified sound engineer is needed, stage technician and light technician.`
                    }]
                }
            }]
        },
        {
            editable: true,
            header: `Hospitality:`,
            items: [{
                paragraph: `The promoter will allow 1 dressing rooms minimum for 2 people. These will be clean, enlightened, comfortable, and must have the option of being closed with a key, which will exclusively be used by the ARTIST and his crew. The stage must be directly linked to those dressing rooms by an enlightened and covered way with a solid floor. The rooms should have a Wifi connexion. Only the owner of a back stage pass (Artist ‘s pass and/or Promotor’s pass) in due form will be authorised to access to the dressing- rooms or to the back stage area.`
            }, {
                paragraph: `The Promoter will take care that the ARTIST will never have to cross the audience to reach the stage.`,
            }, {
                paragraph: `The performance shall not occur in excessively reverberated spaces (churches, warehouses, etc.) Please notify us ahead of time if the performance space is perceivably “echoey.”`
            }]
        },
        {
            editable: false,
            items: [{
                paragraph: `E-mail: {{data.agencyEmail}}`
            }, {
                break: true
            }, {
                paragraph: `{{data.agencyFooterString}}`
            }, {
                break: true
            }, {
                paragraph: `phone: {{data.agencyPhone}}`
            }]
        }
    ]
}