export interface PdfData {
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