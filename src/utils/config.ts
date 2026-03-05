import config from 'config';
import { z } from 'zod';
import logger from './logger.js';

const configSchema = z.object({
    app: z.object({
        port: z.number().int().nonnegative().or(z.string().transform((v) => parseInt(v, 10))),
        env: z.string().min(1)
    }),
    logging: z.object({
        level: z.enum(['debug', 'info', 'warn', 'error'])
    }),
    auth: z.object({
        jwtSecret: z.string().min(1)
    })
});

export type Config = z.infer<typeof configSchema>;

export const validateConfig = (): Config => {
    try {
        const rawConfig = config.util.toObject();
        const validated = configSchema.parse(rawConfig);
        logger.info('✅ Configuration validated successfully');
        return validated;
    } catch (error) {
        if (error instanceof z.ZodError) {
            logger.error('❌ Configuration validation failed:', error.issues);
        } else {
            logger.error('❌ Unexpected error during config validation:', error);
        }
        process.exit(1);
    }
};

const validatedConfig = validateConfig();
export default validatedConfig;
