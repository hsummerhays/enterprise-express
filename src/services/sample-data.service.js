class SampleDataService {
    constructor() {
        // Our in-memory "Database"
        this.sampleData = [
            { id: 1, title: 'Learn Express 5', completed: true },
            { id: 2, title: 'Configure Antigravity WSL', completed: false }
        ];
    }

    async getAll() {
        return this.sampleData;
    }

    async getById(id) {
        return this.sampleData.find(t => t.id === parseInt(id));
    }

    async create(data) {
        const newItem = {
            id: this.sampleData.length + 1,
            title: data.title,
            completed: false
        };
        this.sampleData.push(newItem);
        return newItem;
    }

    async delete(id) {
        const index = this.sampleData.findIndex(t => t.id === parseInt(id));
        if (index === -1) return false;
        this.sampleData.splice(index, 1);
        return true;
    }
}

export const sampleDataService = new SampleDataService();