import { PdfData } from "./pdf-data.model";

export const defaultContractPdf: PdfData = {
    name: '',
    id: '',
    template: 'contract',
    created: new Date(),
    modified: new Date(),
    active: false,
    header: `ARTIST BOOKING CONTRACT ${new Date().getFullYear()}`, 
    sections: [
        {
            editable: false,
            items: [{
                paragraph: 'This Agreement sets forth the terms, conditions, and stipulations whereby the following parties have committed to a booking engagement.'
            }, {
                paragraph: 'Herein after referred to as promoter:'
            }, {
                list: [
                    `Name: {{data.promoterName}}`,
                    `Address: {{data.promoterAdress}}`,
                    `Phone: {{data.promoterPhone}}`,
                    `E-mail: {{data.promoterEmail}}`
                ]
            }, {
                paragraph: `Herein after is referred to as artist:`
            }, {
                list: [
                    `{{data.artistName}}`,
                    `Name: {{data.artistRealName}}`,
                    `Performance: {{data.artistPerformance}}`,
                    `Country of residence: {{data.artistCountry}}`,
                    `Artist Fee: {{data.artistFee}}`,
                ]
            }]
        }, 
        {
            editable: true,
            header: `Performance & billing:`,
            items: [{
                paragraph: `The Artist agrees to play recorded material for a time limit of at least 120 Minutes, unless otherwise pre-arranged.`
            }, {
                paragraph: `The Artist & agency logo is to appear on all promoted & printed material related to the event if not other been agreed. Promotion material must be approved by {{data.agencyCompanyName}}.`
            }, {
                paragraph: `Artist's performance, timing & schedule, including support and following acts must be confirmed and approved by {{data.agencyCompanyName}}.`
            }]
        }, 
        {
            editable: false,
            header: `Payment terms:`,
            items: [{
                paragraph: `Promoter shall pay the Artist the amount outlined as “Artist Fee” in exchange for a 90 minutes show. A deposit in the amount outlined, as “Deposit” must be paid to the Agency not later than the 25-07-2024`,
                editable: true
            }, {
                paragraph: `Deposit must be made payable in Euro.`,
                editable: true
            }, {
                paragraph: `1st Deposit: 1/2 of the fee`,
                editable: true
            }, {
                paragraph: `Deposits Payments must be delivered the bank as followed:`,
            }, {
                list: [
                    `Account Holder: {{data.accountHolder}}`,
                    `Name of Bank: {{data.nameOfBank}}`,
                    `Address: {{data.accountAddress}}`,
                    `IBAN / Account: {{data.accountNumber}}`,
                    `SWIFT-Code: {{data.accountSwift}}`
                ]
            }, {
                paragraph: `The rest of the artist payment, must be paid to the Agency not later than the 25-06-2024. The terms and conditions contained in this contract shall not be affected by turnout of the event.`,
                editable: true
            }]
        }, 
        {
            editable: true,
            header: `Deposits and confirmation:`,
            items: [{
                paragraph: `The performance is not confirmed for the event until the Promoter has received this signed agreement. Promoter must return this signed agreement via scan, postal service (FEDEX, UPS, postal Service, etc.) or email no later than thirty (30) days prior to the event.`
            }]
        },
        {
            editable: true,
            header: `Cancellation terms:`,
            items: [{
                paragraph: `In the event of cancellation by the promoter, none of the amounts already paid will be refunded by the artist. In the event that within 30 days of the Event, as detailed hereunder, the Promoter cancels the Event or if the Event fails to happen for any reason including Act(s) of God and/or closure by any local, state, or EU Law the full amount due shall be payable to Artist. Artist will not be held responsible for the inability to perform for the following reasons:`
            }, {
                list: [
                    `Police or Government Officials closing down location or event.`,
                    `Location/Promoter losing license.`,
                    `Location/Facility improperly equipped (i.e. no electricity, unstable DJ set-up).`,
                    `Poor sound system set-up (i.e. inadequate monitors, mixer and turntables).`,
                    `Incorrect directions or lack of transportation to the event.`,
                    `Natural Disaster, War, etc.`,
                    `Absence of a proper working permit/visa.`,
                ]
            }, {
                paragraph: `In the event of cancellation by the artist for any other reason, will result in the already paid sums refunding to the promoter.`
            }]
        }, 
        {
            editable: true,
            header: `Travel and accommodation:`,
            items: [{
                paragraph: `Promoter shall provide and pay for the Artist’s air transportation costs on a direct flight where possible. Artist flight will be booked only with STAR ALLIANCE FLIGHTS (LUFTHANSA, AUSTRIAN, SWISS Etc).`
            }, {
                paragraph: ` Promoter shall provide each Artist in the band with a single room, 2 nights minimum of a pre-paid 4 star hotel, with a guaranteed early Check in and late checkout time, wireless internet connection if not other been agreed. Confirmation of reservation and prepayment must be emailed to the booking agency no later than thirty (30) days prior to the date of the event.`
            }, {
                paragraph: `The promoter will provide and pay for hospitality which shall include breakfast with basic beverages each day.`,
            }, {
                paragraph: `Promoter is responsible for all ground transportation to and from the airport, hotel, and event for the duration of the Artist’s stay. Pickup driver should have a sign with the artist name on it. In case of a late pick up for over 60 minutes artist will take a hotel at the airport and the promoter will pay the cost.`
            }]
        }, 
        {
            editable: true,
            header: `ospitality & security:`,
            items: [{
                paragraph: `Promoter agrees to provide a secure and restricted area (Green Room) for the Artist and his personal possessions, before, during, and after his performance. Promoter is responsible for the safe keeping of the artist’s equipment and shall be held accountable for any damages or theft.`
            }]
        },
        {
            editable: true,
            header: `Reproduction of performance:`,
            items: [{
                paragraph: `Promoter acknowledges that the artist is fully independent and completely in control of the design and content of the Artist’s performance. Promoter cannot reproduce the Artist’s performance by use of any equipment without written permission from the Artist.`
            }, {
                paragraph: ` The promoter will prevent the broadcasting / recording by radio or any other means of device of the artist's performances, unless otherwise confirmed in advance with the artist.`
            }]
        },
        {
            editable: true,
            header: `Promotion of the event:`,
            items: [{
                paragraph: `Promoter or organizer shall use artist performance name on promo on material a er the agreement regarding booking via e-mail, text message, or other written via communication applications. Furthermore, Promoter shall not represent artist on any promotional materials through the use of derogatory descriptions, gender specific terms or unsuitable images (such as obscene, violent or degrading depictions of women).`
            }, {
                paragraph: `Full length of the performance audio recording, or extended full length video recording of music or art presentation will be only publish after artist’s approval.`
            }, {
                paragraph: `The artist agrees to publish any photos and made during the artist performance by the official Super agencja media means, including YouTube, Instagram, Facebook.`
            }]
        },
        {
            editable: true,
            header: `Equipment requirements:`,
            items: [{
                paragraph: ` Promoter shall provide the Artist with the equipment in the additional tech rider in good working order (Check additional tech & hospitality rider in the press-kit):`,
            }, {
                list: [
                    `DJ Mixer DJMV10,`,
                    `2 CDJ 3000 NSX2,`,
                    `enough empty space to setup computer / sound card /controller / keyboard, around 1 square meter per person,`,
                    `2 power strip (CEE 7/4 "Schuko") 3 slots minimum,`,
                    `1 Table 6f X 3f - Black cloth that covers the front of the table (Please make sure that the table is not wobbling!),`,
                    `proper monitoring on stage,`,
                    `PA SYSTEM: 1st class PA System w/minimum 2 full range speakers & 2 sub woofers,`,
                    `LIGHTING: separate circuit from sound system! Sufficient for venue!`
                ]
            }, {
                paragraph: `The Promoter will supply the equipment described in the additional technical rider, consult Artist on any changes to the rider and know that incorrect or absent equipment that leads to no show stills entitles artist to full fee.`
            }, {
                paragraph: `The promoter will see that there is a sound engineer or equally skilled person present for sound check.`
            }, {
                paragraph: `The Promoter will prepare a time schedule that allows the artist to perform on the requested/agreed time and duration. A proper backstage is a must.`
            }]
        },
        {
            editable: false,
            header: `Final terms:`,
            items: [{
                paragraph: ` Artist’s fee and terms are negotiated and deemed confidential for this event.`,
                editable: true
            }, {
                paragraph: `Terms may not be changed unless both Promoter and Artist endorse any and all changes.`,
                editable: true
            }, {
                paragraph: `This agreement shall not be construed to create or constitute a partnership between Promoter and Artist. The Artist shall not be further liable for any obligations incurred by the Promoter in carrying out any of the provisions hereof. The Artist shall not be held liable for any prosecutions or fines incurred as a result of illegal promotion of the show.`,
                editable: true
            }, {
                break: true
            }, {
                paragraph: `Date: {{data.contractDate}}`
            }, {
                break: true
            }, {
                paragraph: `Promoter name: {{data.promoterName}}`
            }, {
                break: true,
            }, {
                paragraph: `{{data.agencyCompanyName}} on behalf of the artist: {{data.artistName}}`
            }, {
                break: true
            }, {
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