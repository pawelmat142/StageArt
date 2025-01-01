import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PdfData, PdfTemplate } from './model/pdf-data';
import { defaultContractPdf } from './model/default-contract.pdf';
import { defaultTechRiderPdf } from './model/default-tech-rider.pdf';

@Injectable()
export class PdfDataService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
    ) {}

    public getDefaultPdfData(tempalte: PdfTemplate): PdfData {
        switch(tempalte) {
            case 'contract': return defaultContractPdf 
            case 'tech-rider': return defaultTechRiderPdf
            default: throw new NotFoundException(`Not found defalt template ${tempalte}`) 
        }
    }

    
}
