import { Profile } from "../../profile/model/profile.model"
import { Role } from "../../profile/model/role"
import { BotUtil } from "../util/bot.util"
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

                const checkName = await this.services.profileTelegramService.findByName(input)
                if (checkName) {
                    this.error = `Name alredy in use...`
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
                process: async () => this.selectoRole(Role.MANAGER)
            }], [{
                text: `Promoter`,
                process: async () => this.selectoRole(Role.PROMOTER)
            }], [{
                text: `Artist`,
                process: async () => this.selectoRole(Role.ARTIST)
            }]]
        }, {
            order: 4,
            message: [this.error],
            close: true
        }, {
            order: 5,
            message: [`Profile with name ${this.profile.name} and role: ${this.profile.roles?.join(', ')} will be created`],
            buttons: [[{
                text: 'Cancel',
                process: async () => 0
            }, {
                text: 'Confirm',
                process: async () => this.createProfile()
            }]], 
        }, {
            order: 6,
            message: ['Registered!'],
            buttons: [[{
                text: 'Login page',
                url: BotUtil.prepareLoginUrl()
            }]],
            close: true
        }
        ]
    }

    private async selectoRole(role: string): Promise<number> {
        this.profile.roles = [role]
        return 5
    }

    private async createProfile(): Promise<number> {
        try {
            await this.services.profileTelegramService.createProfile(this.profile)
            return 6
        } catch (error) {
            this.error = error
            this.logger.warn(error)
            return 4
        }
    }

}