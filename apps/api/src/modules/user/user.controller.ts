import { Body, Controller, Param, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Roles } from "@thallesp/nestjs-better-auth";
import { UserRole } from "../../common/enum/user-role.enum";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch("/:id")
  @Roles([UserRole.ADMIN])
  async update(@Body() updateUserDto: UpdateUserDto, @Param("id") id: string) {
    return await this.userService.update(id, updateUserDto);
  }
}
