import { Body, Controller, Param, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Roles } from "@thallesp/nestjs-better-auth";
import { UserRole } from "../../common/enum/user-role.enum";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('User')
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch("/:id")
  @ApiOperation({ summary: 'Update user profile (ADMIN)' })
  @Roles([UserRole.ADMIN])
  async update(@Body() updateUserDto: UpdateUserDto, @Param("id") id: string) {
    return await this.userService.update(id, updateUserDto);
  }
}
