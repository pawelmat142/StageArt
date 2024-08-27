import { ManagerData } from "../profile/model/profile-interfaces"
import { DocumentGenerateOptions } from "./document.service"

export type Template = 'contract' | 'tech-rider'

export abstract class DocUtil {

    public static agencyString(managerData: ManagerData): string {
        return `${managerData.agencyName} / ${managerData.accountAddress} / ${managerData.agencyCountry.name}`
    }

    public static addSignatureFooterToEveryPage(documentGenerateOptions?: DocumentGenerateOptions, base64data?: string) {
        if (documentGenerateOptions?.addSignature && base64data) {
            documentGenerateOptions.displayHeaderFooter = true
            documentGenerateOptions.headerTemplate = `<span style="display:none"></span>`
            documentGenerateOptions.footerTemplate = `<div style="width: 100%; text-align: right; padding-right: 20mm;">
                                                        <img src="${base64data}" style="width: 150px;"/>
                                                    </div>`
        }
    }

}