import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';
import healthRoutes from './routes/health.routes.js';
import sampleDataRoutes from './routes/sample-data.routes.js';
import authRoutes from './routes/auth.routes.js';
import { requestLogger } from './middleware/log.middleware.js';
import { globalLimiter } from './middleware/rate-limit.middleware.js';
import { injectDependencies } from './middleware/di.middleware.js';
import config from './utils/config.js';
import ApiResponse from './utils/api-response.js';

const app = express();

// Dependency Injection & Utility Injection
app.use(injectDependencies());

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
app.use('/auth', authRoutes);
app.use('/sample-data', sampleDataRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec as any));

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "WSL/Bash Backend is live (TypeScript)!",
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    const error: any = new Error(`The route ${req.originalUrl} does not exist.`);
    error.status = 404;
    next(error);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : err.message;
    const details = config.app.env === 'development' ? err.stack : null;

    res.status(statusCode).json(ApiResponse.error(message, statusCode, details));
});

export default app;
