import { z } from 'zod';

export const createSampleDataSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is required',
            invalid_type_error: 'Title is required',
        }).min(1, 'Title cannot be empty'),
        completed: z.boolean().optional(),
    }),
});