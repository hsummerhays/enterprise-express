export class SampleDataController {
    sampleDataService;
    constructor(sampleDataService) {
        this.sampleDataService = sampleDataService;
    }
    // GET /sample-data
    getAll = async (req, res) => {
        const sampleData = await this.sampleDataService.getAll();
        return res.status(200).json(res.locals.ApiResponse.success(sampleData));
    };
    // GET /sample-data/:id
    getById = async (req, res) => {
        const id = req.params.id;
        const item = await this.sampleDataService.getById(id);
        if (!item) {
            return res.status(404).json(res.locals.ApiResponse.error('Sample data not found', 404));
        }
        return res.status(200).json(res.locals.ApiResponse.success(item));
    };
    // POST /sample-data
    create = async (req, res) => {
        const { title, completed } = req.body;
        const newItem = await this.sampleDataService.create({ title, completed });
        return res.status(201).json(res.locals.ApiResponse.success(newItem, 'Sample data created successfully'));
    };
    // DELETE /sample-data/:id
    remove = async (req, res) => {
        const id = req.params.id;
        const success = await this.sampleDataService.delete(id);
        if (!success) {
            return res.status(404).json(res.locals.ApiResponse.error('Sample data not found', 404));
        }
        return res.status(204).send(); // No Content
    };
}
