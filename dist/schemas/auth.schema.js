import { z } from 'zod';
import { registry } from '../utils/openapi-registry.js';
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })
});
// We register only the body schema for reuse in Swagger docs
registry.register('LoginRequest', loginSchema.shape.body);
