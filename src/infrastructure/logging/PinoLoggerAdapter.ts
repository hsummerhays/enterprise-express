import type { Logger } from "../../application/ports/LoggerPort.js";
import pinoLogger from "../../utils/logger.js";

export class PinoLoggerAdapter implements Logger {
	info(message: string, context?: Record<string, unknown>): void {
		pinoLogger.info(context ?? {}, message);
	}

	warn(message: string, context?: Record<string, unknown>): void {
		pinoLogger.warn(context ?? {}, message);
	}

	error(message: string, context?: Record<string, unknown>): void {
		pinoLogger.error(context ?? {}, message);
	}

	debug(message: string, context?: Record<string, unknown>): void {
		pinoLogger.debug(context ?? {}, message);
	}
}
