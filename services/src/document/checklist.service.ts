import { Injectable, Logger } from "@nestjs/common";
import { BookingService } from "../booking/services/booking.service";
import { JwtPayload } from "../profile/auth/jwt-strategy";
import { DocumentService } from "./document.service";
import { IllegalStateException } from "../global/exceptions/illegal-state.exception";
import { BookingUtil } from "../booking/util/booking.util";
import { ChecklistItem, CheklistStep } from "../booking/model/checklist.interface";
import { Paper } from "./paper-model";
import { SimpleBookingContext } from "../booking/model/interfaces";
import { Role } from "../profile/model/role";

@Injectable()
export class ChecklistService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly bookingService: BookingService,
        private readonly documentService: DocumentService,
    ) {}

    public async refreshChecklist(formId: string, profile: JwtPayload): Promise<ChecklistItem[]> {
        const ctx = await this.bookingService.buildSimpleContext(formId, profile)

        const status = ctx.booking.status
        if (status !== 'DOCUMENTS') {
            this.logger.warn(`Skip refresh checklist for booking ${ctx.booking.formId} with status: ${status}`)
            return
        }

        this.logger.log(`Refresh checklist for booking ${ctx.booking.formId} by ${profile.uid}`)
       
        const papers = await this.documentService.fetchBookingPapers(ctx.booking.formId)
        this.logger.log(`Found ${papers.length} Paper`)

        let updateFlag = false

        for (let item of ctx.booking.checklist) {
            const paper: Paper | undefined = papers.find(p => p.template === item.template)
            item.paperId = paper?.id

            for (let step of item.steps) {
                if (this.markStep(item, step, paper)) {
                    updateFlag = true
                }
            }
        }

        if (this.checklistReady(ctx)) {
            ctx.booking.status = 'CHECKLIST_COMPLETE'
            BookingUtil.addStatusToHistory(ctx.booking, profile)
            this.logger.warn(`Checklist completed for booking ${ctx.booking.formId}`)
            updateFlag = true
        }

        if (updateFlag) {
            await this.bookingService.update(ctx.booking)
            return ctx.booking.checklist
        } else {
            this.logger.log(`Checklist without changes for booking ${ctx.booking.formId}`)
        }
    }


    private checklistReady(ctx: SimpleBookingContext): boolean {
        return ctx.booking.checklist.every(item => {
            const lastStep = this.lastStep(item)
            return lastStep.ready
        })
    }

    private lastStep(item: ChecklistItem): CheklistStep {
        const lastStep = item.steps[item.steps.length-1]
        if (!lastStep) {
            throw new IllegalStateException(`checklist item step error`)
        }
        return lastStep
    }

    private markStep(item: ChecklistItem, step: CheklistStep, paper?: Paper): boolean {
        const promoterSigned = !!paper?.signatures?.find(s => s.role === Role.PROMOTER)
        const managerSigned = !!paper?.signatures?.find(s => s.role === Role.MANAGER)
        switch (step.type) {
            case 'generate': return this.updateStep(item.name, step, !!paper)
            case 'sign': return this.updateStep(item.name, step, promoterSigned)
            case 'verify': return this.updateStep(item.name, step, promoterSigned && managerSigned)
            case 'upload': return this.updateStep(item.name, step, !!paper)
            default: return false
        }
    }

    private updateStep(name: string, step: CheklistStep, readyCondition: boolean): boolean {
        if (step.ready && !readyCondition) {
            step.ready = undefined
            this.logger.log(`Document ${name}, step [${step.type}] removed ready flag!`)
            return true
        } 
        if (!step.ready && readyCondition) {
            step.ready = new Date()
            this.logger.log(`Document ${name}, step [${step.type}] completed!`)
            return true
        }
        return false
    }


}