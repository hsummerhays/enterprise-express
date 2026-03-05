import { sampleDataService } from '../services/sample-data.service.js';

class SampleDataController {
    // GET /sample-data
    getAll = async (req, res) => {
        const sampleData = await sampleDataService.getAll();
        res.status(200).json(sampleData);
    };

    // GET /sample-data/:id
    getById = async (req, res) => {
        const item = await sampleDataService.getById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Sample data not found' });
        }
        res.status(200).json(item);
    };

    // POST /sample-data
    create = async (req, res) => {
        const { title, completed } = req.body;
        // The title is already validated by the Zod schema
        const newItem = await sampleDataService.create({ title, completed });
        res.status(201).json(newItem);
    };

    // DELETE /sample-data/:id
    remove = async (req, res) => {
        const success = await sampleDataService.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Sample data not found' });
        }
        res.status(204).send(); // No Content
    };
}

// Export a singleton instance
export const sampleDataController = new SampleDataController();