import { ZodError } from 'zod';
import ApiResponse from '../utils/api-response.js';
export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json(ApiResponse.error('Validation failed', 400, error.issues));
        }
        return res.status(400).json(ApiResponse.error('Validation failed', 400, error.message));
    }
};
