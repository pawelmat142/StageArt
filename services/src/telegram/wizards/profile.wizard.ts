import { Profile } from "../../profile/model/profile.model"
import { LoginToken } from "../../profile/profile-telegram.service"
import { ServiceProvider } from "./services.provider"
import { Wizard, WizardStep } from "./wizard"


export class ProfileWizard extends Wizard {

    protected profile: Profile

    constructor(profile: Profile, services: ServiceProvider) {
        super(Number(profile.telegramChannelId), services)
        this.profile = profile
    }

    private error: any

    private _loginToken?: LoginToken

    public getProfile(): Profile {
        return this.profile
    }


    public getSteps(): WizardStep[] {
        return [{
            order: 0,
            message: [`Welcome to Unity Management`],
            buttons: [[{
                text: 'Login',
                process: () => this.loginToken()
            }], [{
                text: 'Delete account',
                process: async () => 4
            }]]
        }, {
            order: 1,
            message: ['Provide your name...'],
            process: async (input: string) => {
                if (!input) {
                    this.error = `Empty...`
                    return 1
                }
                return 3
            }
        }, {
            order: 2,
            message: [this.error],
            close: true
        }, {
            order: 3,
            message: [this.prepareLoginPinMsg()],
            buttons: [[{
                text: 'Login page',
                url: this.prepareLoginUrl()
            }]],
            close: true
        }, {
            order: 4,
            message: [`Are you sure?`],
            buttons: [[{
                text: `No`,
                process: async () => 0
            }, {
                text: `Yes`,
                process: () => this.deleteAccount()
            }]]
        }, {
            order: 5,
            message: [`Your profile deleted successfully`],
            close: true
        }]
    }

    private async loginToken(): Promise<number> {
        try {
            this._loginToken = await this.services.profileTelegramService.loginToken(this.profile.telegramChannelId)
        } catch (error) {
            this.error = error
            this.logger.error(error)
            return 2
        }
        return 3
    }

    private prepareLoginPinMsg() {
        if (this.order === 3) {
            return `Your login PIN: ${this._loginToken.pin}`
        }
        return ''
    }

    private prepareLoginUrl(): string {
        if (this.order === 3) {
            return `${process.env.FRONT_APP_URL}/profile/telegram/${this._loginToken.token}`
        }
        return ''
    }

    private async deleteAccount() {
        try {
            await this.services.profileTelegramService.deleteByTelegram(this.profile)
            return 5
        } catch (error) {
            this.error = error
            this.logger.error(error)
            return 2
        }
    }



}