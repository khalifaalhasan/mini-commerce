import { Params } from "nestjs-pino";

const isDev = process.env.NODE_ENV !== "production";

export const logConfig: Params = {
  pinoHttp: {
    level: isDev ? "debug" : "info",
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 500 || err) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
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
    autoLogging: false
  },
};