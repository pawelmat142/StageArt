import { ManagerData } from "../profile/model/profile-interfaces"

export type Template = 'contract' | 'tech-rider' | 'rental-proof'

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

    public static getContentType(filename: string): string {
        const extension = filename.split('.').pop() 
        switch(extension) {
            case 'png':
            case 'jpeg':
            case 'jpg': return 'image/jpeg'
            case 'pdf': return 'application/pdf'
        }
        throw new Error(`Unprocessable file extension ${extension}`)
    }

}