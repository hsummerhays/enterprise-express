import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRoutes from '#routes/health.routes';
import sampleDataRoutes from '#routes/sample-data.routes';
import { requestLogger } from '#middleware/log.middleware';
import { globalLimiter } from '#middleware/rate-limit.middleware';

const app = express();

// Winston-powered heartbeat
app.use(requestLogger);

// Body Parsing Middleware
app.use(express.json());

// Security and CORS middleware
app.use(helmet());
app.use(cors());
app.use(globalLimiter);

// Mount Routes
app.use('/health', healthRoutes);
app.use('/sample-data', sampleDataRoutes); // Mount the new routes

// Basic Route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "WSL/Bash Backend is live!",
        timestamp: new Date().toISOString()
    });
});

// 404 Handler (Catch-all for undefined routes)
app.use((req, res, next) => {
    const error = new Error(`The route ${req.originalUrl} does not exist.`);
    error.status = 404;
    next(error);
});

// Express 5 catches rejected promises and sends them here automatically
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal Server Error' : 'Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

export default app;