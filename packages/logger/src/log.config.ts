import { Params } from "nestjs-pino";

const isDev = process.env.NODE_ENV !== "production";

export const logConfig: Params = {
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
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
    customProps: () => ({ context: "HTTP" }),
    autoLogging: {
      ignore: (req) => req.url === "/api/health",
    },
  },
};
