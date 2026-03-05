import { describe, it, expect, beforeEach } from 'vitest';
import { sampleDataService } from './sample-data.service.js';

describe('SampleDataService', () => {
    beforeEach(() => {
        // Reset state before each test if necessary
        sampleDataService.sampleData = [
            { id: 1, title: 'Learn Express 5', completed: true },
            { id: 2, title: 'Configure Antigravity WSL', completed: false }
        ];
    });

    it('should return all sample data', async () => {
        const sampleData = await sampleDataService.getAll();
        expect(sampleData.length).toBe(2);
        expect(sampleData[0].title).toBe('Learn Express 5');
    });

    it('should get an item by id', async () => {
        const item = await sampleDataService.getById(1);
        expect(item.title).toBe('Learn Express 5');
    });

    it('should create a new item', async () => {
        const newItem = await sampleDataService.create({ title: 'New task' });
        expect(newItem.id).toBe(3);
        expect(newItem.title).toBe('New task');

        const sampleData = await sampleDataService.getAll();
        expect(sampleData.length).toBe(3);
    });

    it('should delete an item', async () => {
        const deleted = await sampleDataService.delete(1);
        expect(deleted).toBe(true);

        const sampleData = await sampleDataService.getAll();
        expect(sampleData.length).toBe(1);
        expect(sampleData[0].id).toBe(2);
    });

    it('should return false when deleting non-existent item', async () => {
        const deleted = await sampleDataService.delete(999);
        expect(deleted).toBe(false);
    });
});
