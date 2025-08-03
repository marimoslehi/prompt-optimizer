import { RedisClient } from 'redis';

export class CacheService {
    private client: RedisClient;

    constructor(redisClient: RedisClient) {
        this.client = redisClient;
    }

    setCache(key: string, value: any, expiration: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.setex(key, expiration, JSON.stringify(value), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    getCache(key: string): Promise<any | null> {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data ? JSON.parse(data) : null);
                }
            });
        });
    }

    deleteCache(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}