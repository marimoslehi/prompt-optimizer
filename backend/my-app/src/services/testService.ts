import { DbService } from './dbService';
import { cacheService } from './cacheService';
import axios from 'axios';

export interface TestResult {
    id: string;
    model: string;
    response: string;
    tokens: number;
    cost: number;
    responseTime: number;
    quality: number;
}

export interface Test {
    id: string;
    promptId: string;
    models: string[];
    results: TestResult[];
    totalCost: number;
    createdAt: Date;
}

export class TestService {
    private dbService: DbService;

    constructor() {
        this.dbService = new DbService();
    }

    public async runPromptTest(data: {
        userId: string;
        promptId: string;
        models: string[];
        parameters?: Record<string, any>;
    }): Promise<Test> {
        // Get prompt content
        const promptQuery = 'SELECT content FROM prompts WHERE id = $1 AND user_id = $2';
        const promptResult = await this.dbService.query(promptQuery, [data.promptId, data.userId]);
        
        if (promptResult.length === 0) {
            throw new Error('Prompt not found');
        }

        const promptContent = promptResult[0].content;

        // Create test record
        const testQuery = `
            INSERT INTO tests (user_id, prompt_id, models, created_at) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING id, created_at as "createdAt"
        `;
        const testResult = await this.dbService.query(testQuery, [
            data.userId, 
            data.promptId, 
            JSON.stringify(data.models)
        ]);
        const testId = testResult[0].id;

        // Run tests for each model
        const results: TestResult[] = [];
        let totalCost = 0;

        for (const model of data.models) {
            try {
                const startTime = Date.now();
                const response = await this.callAIModel(model, promptContent, data.parameters);
                const responseTime = Date.now() - startTime;

                const testResult: TestResult = {
                    id: `${testId}-${model}`,
                    model,
                    response: response.text,
                    tokens: response.tokens,
                    cost: response.cost,
                    responseTime,
                    quality: this.calculateQuality(response.text)
                };

                // Save result to database
                const resultQuery = `
                    INSERT INTO test_results (test_id, model, response, tokens, cost, response_time, quality) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `;
                await this.dbService.query(resultQuery, [
                    testId, model, response.text, response.tokens, response.cost, responseTime, testResult.quality
                ]);

                results.push(testResult);
                totalCost += response.cost;
            } catch (error: any) {
                console.error(`Error testing model ${model}:`, error);
                // Add error result
                results.push({
                    id: `${testId}-${model}`,
                    model,
                    response: `Error: ${error.message}`,
                    tokens: 0,
                    cost: 0,
                    responseTime: 0,
                    quality: 0
                });
            }
        }

        // Update test with total cost
        await this.dbService.query(
            'UPDATE tests SET total_cost = $1 WHERE id = $2',
            [totalCost, testId]
        );

        return {
            id: testId,
            promptId: data.promptId,
            models: data.models,
            results,
            totalCost,
            createdAt: testResult[0].createdAt
        };
    }

    private async callAIModel(model: string, prompt: string, parameters?: Record<string, any>): Promise<{
        text: string;
        tokens: number;
        cost: number;
    }> {
        // Mock implementation - replace with real API calls
        // This is where you'd integrate with OpenAI, Anthropic, Google APIs
        
        const mockResponses = {
            'gpt-4': {
                text: `GPT-4 Analysis: ${prompt.substring(0, 100)}... [This is a mock response. Replace with real OpenAI API call]`,
                tokens: Math.floor(Math.random() * 200) + 100,
                cost: 0.03
            },
            'claude-3': {
                text: `Claude Analysis: ${prompt.substring(0, 100)}... [This is a mock response. Replace with real Anthropic API call]`,
                tokens: Math.floor(Math.random() * 180) + 90,
                cost: 0.015
            },
            'gemini-pro': {
                text: `Gemini Analysis: ${prompt.substring(0, 100)}... [This is a mock response. Replace with real Google AI API call]`,
                tokens: Math.floor(Math.random() * 150) + 80,
                cost: 0.0005
            }
        };

        const response = mockResponses[model as keyof typeof mockResponses] || mockResponses['gpt-4'];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

        return response;
    }

    private calculateQuality(response: string): number {
        // Simple quality calculation - replace with more sophisticated logic
        const length = response.length;
        const wordCount = response.split(' ').length;
        
        let quality = 70; // Base quality
        
        if (length > 100) quality += 10;
        if (length > 500) quality += 10;
        if (wordCount > 50) quality += 5;
        if (response.includes('analysis') || response.includes('recommendation')) quality += 5;
        
        return Math.min(100, quality);
    }

    public async getTestResults(testId: string, userId: string): Promise<Test> {
        const query = `
            SELECT t.*, tr.model, tr.response, tr.tokens, tr.cost, tr.response_time, tr.quality
            FROM tests t
            LEFT JOIN test_results tr ON t.id = tr.test_id
            WHERE t.id = $1 AND t.user_id = $2
        `;
        
        const results = await this.dbService.query(query, [testId, userId]);
        
        if (results.length === 0) {
            throw new Error('Test not found');
        }

        const test = results[0];
        const testResults: TestResult[] = results
            .filter(r => r.model)
            .map(r => ({
                id: `${testId}-${r.model}`,
                model: r.model,
                response: r.response,
                tokens: r.tokens,
                cost: r.cost,
                responseTime: r.response_time,
                quality: r.quality
            }));

        return {
            id: test.id,
            promptId: test.prompt_id,
            models: JSON.parse(test.models),
            results: testResults,
            totalCost: test.total_cost,
            createdAt: test.created_at
        };
    }

    public async getTestHistory(userId: string, options: {
        page?: number;
        limit?: number;
        promptId?: string;
    } = {}): Promise<{ history: Test[]; total: number }> {
        const { page = 1, limit = 10, promptId } = options;
        const offset = (page - 1) * limit;

        let whereClause = 'WHERE t.user_id = $1';
        const params: any[] = [userId];
        let paramIndex = 2;

        if (promptId) {
            whereClause += ` AND t.prompt_id = $${paramIndex}`;
            params.push(promptId);
            paramIndex++;
        }

        // Get total count
        const countQuery = `SELECT COUNT(*) FROM tests t ${whereClause}`;
        const countResult = await this.dbService.query(countQuery, params);
        const total = parseInt(countResult[0].count);

        // Get tests
        const query = `
            SELECT t.id, t.prompt_id as "promptId", t.models, t.total_cost as "totalCost", 
                   t.created_at as "createdAt", p.title as "promptTitle"
            FROM tests t
            JOIN prompts p ON t.prompt_id = p.id
            ${whereClause}
            ORDER BY t.created_at DESC 
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        params.push(limit, offset);

        const history = await this.dbService.query(query, params);

        return {
            history: history.map(h => ({
                ...h,
                models: JSON.parse(h.models),
                results: [] // Don't include full results in history list
            })),
            total
        };
    }
}

export const testService = new TestService();
