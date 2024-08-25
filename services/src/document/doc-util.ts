import { ManagerData } from "../profile/model/profile-interfaces"

export type Template = 'contract' | 'tech-rider'

export abstract class DocUtil {

    public static footerString(managerData: ManagerData): string {
        return `${managerData.agencyName} / ${managerData.accountAddress} / ${managerData.agencyCountry.name}`
    }

}