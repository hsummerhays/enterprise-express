import pino from "pino";
import config from "./config.js";

const logger = pino({
	level: config.logging.level,
	...(config.app.env !== "production" && {
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
				translateTime: "yyyy-mm-dd HH:MM:ss",
				ignore: "pid,hostname",
			},
		},
	}),
});

export default logger;
