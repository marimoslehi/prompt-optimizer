import { createClient } from 'redis';

export class CacheService {
    private client: any;
    private isConnected: boolean = false;

    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });
        
        this.client.on('error', (err: any) => {
            console.error('Redis Client Error', err);
        });
    }

    async connect(): Promise<void> {
        if (!this.isConnected) {
            await this.client.connect();
            this.isConnected = true;
        }
    }

    async setCache(key: string, value: any, expiration: number = 3600): Promise<void> {
        await this.connect();
        await this.client.setEx(key, expiration, JSON.stringify(value));
    }

    async getCache(key: string): Promise<any | null> {
        await this.connect();
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async deleteCache(key: string): Promise<void> {
        await this.connect();
        await this.client.del(key);
    }

    async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.client.quit();
            this.isConnected = false;
        }
    }
}

export const cacheService = new CacheService();
