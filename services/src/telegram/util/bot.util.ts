import { Wizard, WizardButton, WizardStep } from "../wizards/wizard"
import { WizBtn } from "./wiz-btn"

export abstract class BotUtil {

    public static msgFrom = (lines: string[]) => {
        return (lines || []).reduce((acc, line) => acc + line + '\n', '')
    }

    public static readonly WiZARD_EXPIRATION_MINUTES = 15 

    public static isExpired = (wizard: Wizard): boolean => {
        const expirationTime = new Date(wizard.modified)
        expirationTime.setMinutes(expirationTime.getMinutes() + this.WiZARD_EXPIRATION_MINUTES)
        return expirationTime < new Date()
    }
    

    public static getRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    public static findClickedButton = (step: WizardStep, callbackData: string): WizardButton => {
        if (step.backButton && callbackData === WizBtn.BACK) {
            BotUtil.addBackBtnIfNeeded(step)
            const btns = step.buttons.pop()
            return btns[0]
        }
        for (let btns of step.buttons || []) {
            for (let btn of btns) {
                if (btn.callback_data) {
                    if (btn.callback_data === callbackData) {
                        return btn
                    } 
                } else {
                    if (btn.text === callbackData) {
                        return btn
                    }
                }
            }
        }
    }

    public static addBackBtnIfNeeded = (step: WizardStep): void => {
        if (step.backButton) {
            BotUtil.addBackBtn(step)
        }
    }

    public static addBackBtn = (step: WizardStep): void => {
        step.buttons = step.buttons || []
        step.buttons.push([{
            text: WizBtn.BACK_LABEL,
            callback_data: WizBtn.BACK,
            process: async () => 0
        }])
    }

    public static getBackSwitchButton = (wizardName: string): WizardButton => {
        return {
            text: WizBtn.BACK_LABEL,
            callback_data: WizBtn.BACK_LABEL,
            switch: wizardName
        }
    }

}