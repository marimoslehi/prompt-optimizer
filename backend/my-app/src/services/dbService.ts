import { Pool } from 'pg';

export class DbService {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
        });
    }

    public async query(text: string, params?: any[]) {
        const res = await this.pool.query(text, params);
        return res.rows;
    }

    public async close() {
        await this.pool.end();
    }
}