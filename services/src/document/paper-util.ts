import { ManagerData } from "../profile/model/profile-interfaces"

export type Template = 'contract' | 'tech-rider'

export interface PaperGenerateParameters {
    headerTemplate?: string
    footerTemplate?: string,
    displayHeaderFooter?: boolean,
}

export abstract class PaperUtil {

    public static agencyString(managerData: ManagerData): string {
        return `${managerData.agencyName} / ${managerData.accountAddress} / ${managerData.agencyCountry.name}`
    }

    public static preparePaperGenerateParams(data: any): PaperGenerateParameters {
        const result: PaperGenerateParameters = {}
        const promoterSignature = data.promoterSignature
        const managerSignature = data.managerSignature
        if (promoterSignature || managerSignature) {
            result.displayHeaderFooter = true
            result.headerTemplate = `<span style="display:none"></span>`
            result.footerTemplate = `<div style="width: 100%; display: flex; justify-content: space-between; padding: 0 20mm;">`
            result.footerTemplate += managerSignature ? `<img src="${managerSignature}" style="width: 150px;"/>` : '<div></div>'
            result.footerTemplate += promoterSignature ? `<img src="${promoterSignature}" style="width: 150px;"/>` : '<div></div>'
            result.footerTemplate += `</div>`
        }
        return result
    }

}