import { Template } from "../../global/document/doc-util"

export type StepMode = 'blank' | 'available' | 'ready' | 'error' 
export type StepType = 'generate' | 'sign' | 'upload' | 'verify'

export interface ChecklistStep {
    type: StepType
    forRoles?: string[]
    ready?: Date
}

export interface ChecklistItem {
    name: string
    subName?: string
    template?: Template
    paperId?: string
    steps: ChecklistStep[] 
}

export interface TileStep extends ChecklistStep {
    mode: StepMode
    name: string
}

export interface ChecklistTile extends ChecklistItem {
    tileSteps: TileStep[]
}


