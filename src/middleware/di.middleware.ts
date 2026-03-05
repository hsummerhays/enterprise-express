import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../utils/api-response.js';

/**
 * Injects shared utilities and services into the request lifecycle.
 */
export const injectDependencies = (dependencies: any = {}) => (req: Request, res: Response, next: NextFunction) => {
    // Inject Utilities
    (res.locals as any).ApiResponse = ApiResponse;

    // Inject Services (if any passed)
    (res.locals as any).services = dependencies.services || {};

    next();
};
