// src/app.module.ts
import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { ProductModule } from "./modules/product/product.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { CategoryModule } from "./modules/category/category.module";
import { auth } from "./modules/auth/auth";
import { logConfig } from "@mini-commerce/logger";

@Module({
  imports: [
    LoggerModule.forRoot(logConfig),
    AuthModule.forRoot({ auth }),
    ProductModule,
    PrismaModule,
    CategoryModule,
  ],
})
export class AppModule {}
