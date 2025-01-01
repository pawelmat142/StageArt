export interface PdfDataDto {
    id: string
    name: string
    template: PdfTemplate
    created: Date
    modified: Date
    header: string
    sections: PdfSection[]
}

export interface PdfData {
    id: string
    name: string
    template: PdfTemplate
    created: Date
    modified: Date
    header: string
    sections: PdfSection[]
    data: any
}

export interface PdfSection {
    editable?: boolean
    header?: string
    items: PdfSectionItem[]
}

export interface PdfSectionItem {
    paragraph?: string
    subsection?: PdfSection
    list?: string[]
    break?: boolean
    editable?: boolean
}

export type PdfTemplate = 'contract' | 'tech-rider'