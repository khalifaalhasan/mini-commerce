import { Module } from "@nestjs/common";
import { ProductModule } from "./modules/product/product.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { LoggerModule } from "nestjs-pino";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./modules/auth/auth";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV === "development"
            ? { target: "pino-pretty", options: { colorize: true } }
            : undefined,
      },
    }),
    ProductModule,
    PrismaModule,
    AuthModule.forRoot({ auth }),
  ],
})
export class AppModule {}
