import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { sampleDataService } from '../services/sample-data.service.js';

describe('Sample Data Routes API (Integration)', () => {
    beforeEach(() => {
        // Reset the in-memory sampleData before each test
        sampleDataService.sampleData = [
            { id: 1, title: 'Learn Express 5', completed: true },
            { id: 2, title: 'Configure Antigravity WSL', completed: false }
        ];
    });

    it('GET /sample-data should return all sample data', async () => {
        const response = await request(app).get('/sample-data');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0].title).toBe('Learn Express 5');
    });

    it('POST /sample-data should create a new item successfully', async () => {
        const payload = { title: 'Test new task', completed: false };
        const response = await request(app)
            .post('/sample-data')
            .send(payload);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test new task');

        // Ensure state was actually updated
        const sampleData = await sampleDataService.getAll();
        expect(sampleData.length).toBe(3);
    });

    it('POST /sample-data should return 400 when validation fails (missing title)', async () => {
        const payload = { completed: true }; // Missing required title
        const response = await request(app)
            .post('/sample-data')
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Validation failed');
        expect(response.body).toHaveProperty('details');
        expect(response.body.details[0].path).toContain('title');
    });

    it('DELETE /sample-data/:id should remove an item and return 204', async () => {
        const response = await request(app).delete('/sample-data/1');

        expect(response.status).toBe(204); // No Content

        // Verify it was actually deleted
        const sampleData = await sampleDataService.getAll();
        expect(sampleData.length).toBe(1);
    });

    it('DELETE /sample-data/:id should return 404 for a non-existent item', async () => {
        const response = await request(app).delete('/sample-data/999'); // Non-existent ID

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Sample data not found');
    });
});
