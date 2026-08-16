import { Module } from "@nestjs/common";
import { ProductModule } from "./modules/product/product.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { LoggerModule } from "nestjs-pino";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./modules/auth/auth";

const isDev = process.env.NODE_ENV !== "production";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: isDev ? "debug" : "info",
        transport: isDev
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                singleLine: false,
                translateTime: "SYS:HH:MM:ss",
                ignore: "pid,hostname",
                messageKey: "msg",
                levelFirst: true,
              },
            }
          : undefined,
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
            };
          },
          res(res) {
            return { statusCode: res.statusCode };
          },
        },
        customProps: () => ({
          context: "HTTP",
        }),
        autoLogging: {
          ignore: (req) => req.url === "/api/health",
        },
      },
    }),
    ProductModule,
    PrismaModule,
    AuthModule.forRoot({ auth }),
  ],
})
export class AppModule {}
