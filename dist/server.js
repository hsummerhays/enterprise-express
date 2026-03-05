import app from './app.js';
import logger from './utils/logger.js';
import config from './utils/config.js';
import { disconnectDatabase } from './utils/db.js';
const PORT = config.app.port || 3000;
const server = app.listen(PORT, () => {
    logger.info('Express server successfully ignited (TypeScript)', {
        port: PORT,
        env: config.app.env,
        wsl_mode: 'mirrored'
    });
    logger.info(`Access your API at http://localhost:${PORT}`);
});
// --- GRACEFUL SHUTDOWN ---
const gracefulShutdown = async (signal) => {
    logger.info(`${signal} signal received: closing HTTP server...`);
    server.close(async () => {
        logger.info('HTTP server closed.');
        try {
            await disconnectDatabase();
            logger.info('Resources cleaned up smoothly.');
        }
        catch (error) {
            logger.error('Error during resource cleanup:', error);
        }
        process.exit(0);
    });
    // Force shutdown after 10 seconds if it takes too long
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
