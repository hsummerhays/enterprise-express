import ApiResponse from '../utils/api-response.js';
/**
 * Injects shared utilities and services into the request lifecycle.
 */
export const injectDependencies = (dependencies = {}) => (req, res, next) => {
    // Inject Utilities
    res.locals.ApiResponse = ApiResponse;
    // Inject Services (if any passed)
    res.locals.services = dependencies.services || {};
    next();
};
