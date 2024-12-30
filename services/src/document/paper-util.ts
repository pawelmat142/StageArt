import { BadRequestException } from "@nestjs/common"
import { PdfData, PdfTemplate } from "../pdf/model/pdf-data"
import { ManagerData } from "../profile/model/profile-interfaces"
import { PaperSignature } from "./paper-model"
import { Role } from "../profile/model/role"

export type Template = PdfTemplate | 'rental-proof'

export interface PaperGenerateParameters {
    headerTemplate?: string
    footerTemplate?: string,
    displayHeaderFooter?: boolean,
}

export abstract class PaperUtil {

    public static agencyString(managerData: ManagerData): string {
        return `${managerData.agencyName} / ${managerData.accountAddress} / ${managerData.agencyCountry.name}`
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

    public static addSignaturesData(data: any, paperSignatures: PaperSignature[]) {
        if (!paperSignatures.length) {
            throw new BadRequestException(`Signatures missing`)
        }
        paperSignatures.forEach(signature => {
            if (signature.role === Role.PROMOTER) {
                data.promoterSignature = signature.base64
            }
            if (signature.role === Role.MANAGER) {
                data.managerSignature = signature.base64
            }
            if (signature.role === Role.ARTIST) {
                data.artistSignature = signature.base64
            }
        })
    }

}