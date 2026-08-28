import { Logger, Params, PinoLogger } from 'nestjs-pino';

const SILENCED_BOOTSTRAP_CONTEXTS = new Set([
  'RouterExplorer',
  'RoutesResolver',
  'LegacyRouteConverter',
]);

export class FilteredLogger extends Logger {
  constructor(pinoLogger: PinoLogger, params: Params) {
    super(pinoLogger, params);
  }

  log(message: any, context?: string) {
    if (context && SILENCED_BOOTSTRAP_CONTEXTS.has(context)) return;
    super.log(message, context);
  }
}