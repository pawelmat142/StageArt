export interface PdfDataDto {
    id: string
    active: boolean
    name: string
    template: PdfTemplate
    created: Date
    modified: Date
    header: string
    sections: PdfSection[]
}

export interface PdfSection {
    editable?: boolean
    header?: string
    items: PdfSectionItem[]

    show?: boolean
}

export interface PdfSectionItem {
    paragraph?: string
    subsection?: PdfSection
    list?: string[]
    break?: boolean
    editable?: boolean
}

export const PdfTemplateConst = ['contract', 'tech-rider'] as const;
export type PdfTemplate = typeof PdfTemplateConst[number];
