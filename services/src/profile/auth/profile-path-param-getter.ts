import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "./jwt-strategy";

export const Profile = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): JwtPayload => {
      const request = ctx.switchToHttp().getRequest();
      return request.profile as JwtPayload
    },
);