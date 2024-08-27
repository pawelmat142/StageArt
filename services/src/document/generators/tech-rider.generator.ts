import { Injectable } from "@nestjs/common";
import { DocUtil, Template } from "../doc-util"
import { DocumentService } from "../document.service";
import { ProfileService } from "../../profile/profile.service";
import { AbstractDocumentGenerator } from "./abstract-document.generator";

export interface TechRiderDocumentData {
    agencyName: string
    agencyPhone: string
    agencyEmail: string
    agencyFooterString: string
}

@Injectable()
export class TechRiderDocumentGenerator extends AbstractDocumentGenerator<TechRiderDocumentData> {

    constructor(
        protected readonly documentService: DocumentService,
        private readonly profileService: ProfileService,
    ) {
        super(documentService);
    }

    protected get template(): Template {
        return 'tech-rider'
    }

    override async prepareData(ctx: any): Promise<TechRiderDocumentData> {

        const managerData = await this.profileService.fetchManagerData(ctx.booking.managerUid)

        return {
            agencyName: managerData.agencyName,
            agencyPhone: managerData.agencyPhone,
            agencyEmail: managerData.agencyEmail,
            agencyFooterString: DocUtil.agencyString(managerData),
        }
    }
}