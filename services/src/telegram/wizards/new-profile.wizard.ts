import { Profile, Role } from "../../profile/model/profile.model"
import { ServiceProvider } from "./services.provider"
import { Wizard, WizardStep } from "./wizard"

export class NewProfileWizard extends Wizard {

    constructor(chatId: number, services: ServiceProvider) {
        super(chatId, services)
        this.profile.telegramChannelId = chatId.toString()
    }

    private profile: Partial<Profile> = {}

    private error: string

    public static USDT_MIN_LIMIT = 10

    public getSteps(): WizardStep[] {

        return [{
            order: 0,
            message: [
                `Unity Management agency`,
                `Would you like to register?`
            ],
            buttons: [[{
                text: 'No',
                process: async () => 2
            }, {
                text: `Yes`,
                process: async () => 1
            }]]
        }, {
            order: 1,
            message: ['Provide your name...'],
            process: async (input: string) => {
                if (!input) {
                    this.error = `Empty...`
                    return 1
                }
                this.profile.name = input
                return 3
            }
        }, {
            order: 2,
            message: [`Bye`],
            close: true
        }, {
            order: 3,
            message: [`Select your role: `],
            buttons: [[{
                text: `Manager`,
                process: async () => this.createProfile('MANAGER')
            }], [{
                text: `Promoter`,
                process: async () => this.createProfile('PROMOTER')
            }], [{
                text: `Artist`,
                process: async () => this.createProfile('ARTIST')
            }]]
        }, {
            order: 4,
            message: [this.error],
            close: true
        }, {
            order: 5,
            message: ['Registered!'],
            close: true,
        }
        ]
    }


    private async createProfile(role: Role): Promise<number> {
        this.profile.role = role
        try {
            await this.services.profileTelegramService.createProfile(this.profile)
            return 5
        } catch (error) {
            this.error = error
            this.logger.warn(error)
            return 4
        }
    }


}