import { Expose } from "class-transformer"

export class PdfDataDto {
    @Expose() id: string
    @Expose() active: boolean
    @Expose() name: string
    @Expose() template: PdfTemplate
    created: Date
    @Expose() modified: Date
    @Expose() header: string
    @Expose() sections: PdfSection[]
}

export interface PdfSection {
    editable?: boolean
    header?: string
    items: PdfSectionItem[]
}

export interface PdfSectionItem {
    paragraph?: string
    subsection?: PdfSection //subsection need set editable on item level and on section level
    list?: string[]
    break?: boolean
    editable?: boolean
}

export type PdfTemplate = 'contract' | 'tech-rider'