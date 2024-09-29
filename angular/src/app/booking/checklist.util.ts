import { BookingUtil } from "./booking.util";
import { ChecklistStep, ChecklistTile, TileStep } from "./interface/checklist.interface";
import { BookingDto } from "./services/booking.service";

export abstract class ChecklistUtil {

    public static prepareTiles(booking: BookingDto, profileUid: string): ChecklistTile[] {
        const rolesInBookingContext = BookingUtil.bookingRoles(booking, profileUid)
        return booking.checklist.map(item => {
            let tileSteps: TileStep[] = item.steps.map((step, i) => {
                if (step.ready) {
                    return ({
                        ...step,
                        mode: 'ready',
                        name: this.tileStepName(step)
                    })
                } else {
                    const firstNotReadyStep = i === 0 || !!item.steps[i-1].ready
                    const availableForRole = !step.forRoles || step.forRoles.some(role => rolesInBookingContext.includes(role))
                    return ({
                        ...step,
                        mode: firstNotReadyStep && availableForRole ? 'available' : 'blank',
                        name: this.tileStepName(step)
                    })
                }
            })
            return {
                ...item,
                tileSteps
            }

        })
    }

    private static tileStepName(step: ChecklistStep): string {
        switch (step.type) {
            case 'generate': return step.ready ? 'Generated' : 'Generate'
            case 'sign': return step.ready ? 'Signed' : 'Sign'
            case 'upload': return step.ready ? 'Uploaded' : 'Upload'
            case 'verify': return step.ready ? 'Verified' : 'Verify'
        }
    }

    public static canGenerate(tile: ChecklistTile): boolean {
        return tile.template!! && tile.tileSteps.some(step => step.type === 'generate' && step.mode === 'available')
    }

    public static canDownload(tile: ChecklistTile): boolean {
        return !!tile.paperId && tile.steps.some(step => step.type === 'generate' && step.ready)
    }

    public static canDownloadUploaded(tile: ChecklistTile): boolean {
        return !!tile.paperId && tile.steps.some(step => step.type === 'upload' && step.ready)
    }

    public static canSign(tile: ChecklistTile): boolean {
        return tile.tileSteps.some(step => step.type === 'sign' && step.mode === 'available')
    }
    
    public static canUpload(tile: ChecklistTile): boolean {
        return tile.tileSteps.some(step => step.type === 'upload' && step.mode === 'available')
    }

    public static canVerify(tile: ChecklistTile): boolean {
        return tile.tileSteps.some(step => step.type === 'verify' && step.mode === 'available')
    }

    public static canDownloadSigned(tile: ChecklistTile): boolean {
        return tile.steps.some(step => step.type === 'sign' && step.ready)
    }


}