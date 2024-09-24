import { Injectable } from "@nestjs/common";
import { ProfileService } from "../../profile/profile.service";
import { BookingContext } from "../../booking/model/interfaces";
import { PaperUtil } from "../paper-util";

@Injectable()
export class TechRiderDataProvider {

    constructor(
        private readonly profileService: ProfileService,
    ) {}

    public async prepareData(ctx: BookingContext): Promise<any> {
        
        const managerData = await this.profileService.fetchManagerData(ctx.booking.managerUid)

        return {
            agencyName: managerData.agencyName,
            agencyPhone: managerData.agencyPhone,
            agencyEmail: managerData.agencyEmail,
            agencyFooterString: PaperUtil.agencyString(managerData),
        }
    }

}