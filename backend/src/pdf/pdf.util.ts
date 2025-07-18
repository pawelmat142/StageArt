import { PaperGenerateParameters } from '../document/paper-util';
import { defaultContractPdf } from './model/default-contract.pdf';
import { defaultTechRiderPdf } from './model/default-tech-rider.pdf';
import { PdfTemplate } from './model/pdf-data';
import { PdfData } from './model/pdf-data.model';

export abstract class PdfUtil {
  public static prepareDefaultPdfData(template: PdfTemplate): PdfData {
    if (template === 'contract') {
      return defaultContractPdf;
    }
    if (template === 'tech-rider') {
      return defaultTechRiderPdf;
    }
    throw new Error(`Not found template: ${template}`);
  }

  public static preparePaperGenerateParams(
    data?: any,
  ): PaperGenerateParameters {
    const result: PaperGenerateParameters = {};
    if (!data) {
      return result;
    }
    const promoterSignature = data.promoterSignature;
    const managerSignature = data.managerSignature;
    if (promoterSignature || managerSignature) {
      result.displayHeaderFooter = true;
      result.headerTemplate = `<span style="display:none"></span>`;
      result.footerTemplate = `<div style="width: 100%; display: flex; justify-content: space-between; padding: 0 20mm;">`;
      result.footerTemplate += managerSignature
        ? `<img src="${managerSignature}" style="width: 150px;"/>`
        : '<div></div>';
      result.footerTemplate += promoterSignature
        ? `<img src="${promoterSignature}" style="width: 150px;"/>`
        : '<div></div>';
      result.footerTemplate += `</div>`;
    }
    return result;
  }
}
