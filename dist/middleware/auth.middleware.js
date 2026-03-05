import jwt from 'jsonwebtoken';
import config from '../utils/config.js';
import ApiResponse from '../utils/api-response.js';
/**
 * Middleware to authenticate requests using a Bearer Token (JWT).
 */
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(ApiResponse.error('Authentication required. Missing Bearer token.', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, config.auth.jwtSecret);
        req.user = decoded; // Attach user info to request
        next();
    }
    catch (error) {
        let message = 'Invalid or expired token.';
        if (error.name === 'TokenExpiredError')
            message = 'Token has expired.';
        return res.status(401).json(ApiResponse.error(message, 401));
    }
};
