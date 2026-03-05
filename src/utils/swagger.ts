import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './openapi-registry.js';
import '../schemas/sample-data.schema.js';
import '../schemas/auth.schema.js';

// Define Security Scheme
registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
});

registry.registerPath({
    method: 'post',
    path: '/auth/login',
    summary: 'Authenticate user and receive JWT',
    description: 'Use the following credentials for testing: admin@example.com / P@ssword123',
    tags: ['Auth'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: { '$ref': '#/components/schemas/LoginRequest' }
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Login successful',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                            data: {
                                type: 'object',
                                properties: {
                                    user: { type: 'object' },
                                    token: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        401: { description: 'Authentication failed' }
    }
});

// Define Path Operations manually in code (Modern way, no JSDoc needed)
registry.registerPath({
    method: 'get',
    path: '/health',
    summary: 'System health check',
    tags: ['System'],
    responses: {
        200: {
            description: 'Returns the current system status',
            content: {
                'application/json': {
                    schema: { type: 'object' }
                },
            },
        },
    },
});

registry.registerPath({
    method: 'get',
    path: '/sample-data',
    summary: 'Retrieve all sample data',
    tags: ['SampleData'],
    responses: {
        200: {
            description: 'A list of sample data items',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: { '$ref': '#/components/schemas/SampleData' }
                    },
                },
            },
        },
    },
});

registry.registerPath({
    method: 'post',
    path: '/sample-data',
    summary: 'Create a new sample data item',
    tags: ['SampleData'],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['title'],
                        properties: {
                            title: { type: 'string', example: 'New Task Title' },
                            completed: { type: 'boolean', example: false }
                        }
                    },
                },
            },
        },
    },
    responses: {
        201: { description: 'Successfully created' },
        400: { description: 'Validation failed' }
    }
});

registry.registerPath({
    method: 'delete',
    path: '/sample-data/{id}',
    summary: 'Delete a sample data item',
    tags: ['SampleData'],
    security: [{ bearerAuth: [] }],
    parameters: [{
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
    }],
    responses: {
        204: { description: 'Successfully deleted' },
        404: { description: 'Item not found' }
    },
});

const openApiConfig = {
    openapi: '3.0.0',
    info: {
        title: 'WSL-Native Express Backend API',
        version: '1.0.0',
        description: 'A modern Express 5 API documentation powered by Zod and OpenAPI Registry',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local development server' }],
};

export const swaggerSpec = new OpenApiGeneratorV3(registry.definitions).generateDocument(openApiConfig);
