import { Expose } from "class-transformer"
import { Role } from "./profile.model"


export class ProfileDto {
    
    @Expose()
    uid: string
    
    @Expose()
    name: string
    
    @Expose()
    role: Role
    
    @Expose()
    telegramChannelId?: string

}