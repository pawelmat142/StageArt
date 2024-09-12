import { Role } from "../../profile/model/role";
import { ChecklistItem, CheklistStep } from "../../booking/model/checklist.interface";

export abstract class ChecklistGenerator {

    public static prepareBookingChecklist(): ChecklistItem[] {
        return [
            ChecklistGenerator.prepareContract(),
            ChecklistGenerator.prepareTechRider(),
            ChecklistGenerator.prepareSpotProof()
        ]
    }

    public static prepareContract(): ChecklistItem {
        return {
            name: 'Contract',
            template: 'contract',
            steps: [
                this.generateStep(),
                this.signStep(),
                this.verifyStep(),
            ]
        }
    }

    public static prepareTechRider(): ChecklistItem {
        return {
            name: 'Tech rider',
            template: 'tech-rider',
            steps: [this.generateStep()]
        }
    }

    public static prepareSpotProof(): ChecklistItem {
        return {
            name: 'Rental agreement',
            subName: "Legal issues of event's spot",
            steps: [
                this.uploadStep(),
                this.verifyStep(),
            ]
        }
    }

    private static generateStep(): CheklistStep {
        return {
            type: 'generate',
            forRoles: [Role.PROMOTER],
        }
    }

    private static signStep(): CheklistStep {
        return {
            type: 'sign',
            forRoles: [Role.PROMOTER],
        }
    }

    private static verifyStep(): CheklistStep {
        return {
            type: 'verify',
            forRoles: [Role.MANAGER]
        }
    }

    private static uploadStep(): CheklistStep {
        return {
            type: 'upload',
            forRoles: [Role.PROMOTER]
        }
    }

}