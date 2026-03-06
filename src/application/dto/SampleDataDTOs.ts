export interface CreateSampleDataRequest {
	title: string;
	completed?: boolean;
}

export interface SampleDataResponse {
	id: number;
	title: string;
	completed: boolean;
}
