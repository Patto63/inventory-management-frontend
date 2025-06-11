import { HttpHandler, IHttpResponse } from '@/core/data/interfaces/HttpHandler';
import { ICondition, PaginatedConditions } from '../data/interfaces/condition.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

interface ConditionServiceProps {
    getConditions: (page?: number, limit?: number) => Promise<PaginatedConditions>;
    getConditionById: (id: string) => Promise<ICondition | undefined>;
    createCondition: (condition: Partial<ICondition>) => Promise<ICondition | undefined>;
    updateCondition: (id: string, condition: Partial<ICondition>) => Promise<ICondition | undefined>;
    deleteCondition: (id: string) => Promise<void>;
}

export class ConditionService implements ConditionServiceProps {
    private static instance: ConditionService;
    private httpClient: HttpHandler;
    private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}conditions`;

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): ConditionService {
        if (!ConditionService.instance) {
            ConditionService.instance = new ConditionService();
        }
        return ConditionService.instance;
    }

    public async getConditions(page = 1, limit = 10): Promise<PaginatedConditions> {
        try {
            const response = await this.httpClient.get<PaginatedConditions>(
                `${ConditionService.url}?page=${page}&limit=${limit}`
            );
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching conditions:', error);
            throw error;
        }
    }

    public async getConditionById(id: string): Promise<ICondition | undefined> {
        try {
            const response = await this.httpClient.get<ICondition>(`${ConditionService.url}/${id}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching condition:', error);
            return undefined;
        }
    }

    public async createCondition(condition: Partial<ICondition>): Promise<ICondition | undefined> {
        try {
            const response = await this.httpClient.post<ICondition>(
                ConditionService.url,
                condition
            );
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data;
        } catch (error) {
            console.error('Error creating condition:', error);
            throw error;
        }
    }

    public async updateCondition(id: string, condition: Partial<ICondition>): Promise<ICondition | undefined> {
        try {
            const response = await this.httpClient.patch<ICondition>(
                `${ConditionService.url}/${id}`,
                condition
            );
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data;
        } catch (error) {
            console.error('Error updating condition:', error);
            throw error;
        }
    }

    public async deleteCondition(id: string): Promise<void> {
        try {
            const response = await this.httpClient.delete<void>(`${ConditionService.url}/${id}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
        } catch (error) {
            console.error('Error deleting condition:', error);
            throw error;
        }
    }
} 