import winston from "winston";
import config from "./config.js";

const logger = winston.createLogger({
	level: config.logging.level,
	format: winston.format.combine(
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.json(),
	),
	defaultMeta: { service: "express-backend" },
	transports: [
		new winston.transports.File({ filename: "logs/combined.log" }),
		new winston.transports.File({ filename: "logs/error.log", level: "error" }),
	],
});

if (config.app.env !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
			),
		}),
	);
}

export default logger;
