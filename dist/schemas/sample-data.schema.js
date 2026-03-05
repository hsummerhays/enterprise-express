import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { registry } from '../utils/openapi-registry.js';
extendZodWithOpenApi(z);
export const SampleDataSchema = registry.register('SampleData', z.object({
    id: z.number().openapi({ example: 1 }),
    title: z.string().openapi({ example: 'Learn Express 5' }),
    completed: z.boolean().openapi({ example: true }),
}));
export const createSampleDataSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').openapi({ example: 'New Task Title' }),
        completed: z.boolean().optional().openapi({ example: false }),
    }),
});
