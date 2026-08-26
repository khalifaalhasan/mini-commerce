// src/app.module.ts
import { Module } from "@nestjs/common";
import { LoggerModule, PinoLogger } from "nestjs-pino";
import { ProductModule } from "./modules/product/product.module";
import { PrismaModule } from "./modules/prisma/prisma.module";

import { CategoryModule } from "./modules/category/category.module";
import { FilteredLogger, logConfig } from "@mini-commerce/logger";
import { UserModule } from "./modules/user/user.module";
import { auth } from "./modules/auth/auth.config";
import { AuthModule } from "@thallesp/nestjs-better-auth";

@Module({
  providers: [
    {
      provide: FilteredLogger,
      useFactory: (pinoLogger: PinoLogger) => new FilteredLogger(pinoLogger, logConfig),
      inject: [PinoLogger],
    },
  ],
  imports: [
    LoggerModule.forRoot(logConfig),
    AuthModule.forRoot(auth),
    ProductModule,
    PrismaModule,
    CategoryModule,
    UserModule,
  ],
})
export class AppModule {}
