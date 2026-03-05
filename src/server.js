import app from './app.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // Structured log for the startup event
    logger.info('Express server successfully ignited', {
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        wsl_mode: 'mirrored'
    });

    // We can also log a separate message for the URL
    logger.info(`Access your API at http://localhost:${PORT}`);
});