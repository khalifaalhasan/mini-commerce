import { Injectable, Logger } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { BaseUserDto } from "./dto/base-user.dto";
import { LogContext, LogEvent } from "@mini-commerce/logger";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  // create udah di handle sm better auth lek

  // update
  async update(id: string, updateUserDto: UpdateUserDto) {
    const users = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        image: updateUserDto.image,
      },
    });
    this.logger.log(
      {
        event: LogEvent.UPDATE,
        userId: users.id,
      },
      LogContext.USER,
    );
    return users;
  }
}
