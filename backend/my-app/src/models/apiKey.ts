import { Pool } from 'pg';

export interface ApiKey {
  id?: number;
  user_id: number;
  provider: string;
  key: string; // encrypted
  last_used?: Date | null;
  request_count?: number;
  cost?: number;
  created_at?: Date;
  updated_at?: Date;
}

export class ApiKeyModel {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: 'your_db_user',
      host: 'localhost',
      database: 'your_db_name',
      password: 'your_db_password',
      port: 5432,
    });
  }

  async upsertKey(key: ApiKey): Promise<ApiKey> {
    const result = await this.pool.query(
      `INSERT INTO api_keys (user_id, provider, key)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, provider)
       DO UPDATE SET key = $3, updated_at = NOW()
       RETURNING *`,
      [key.user_id, key.provider, key.key]
    );
    return result.rows[0];
  }

  async deleteKey(userId: number, provider: string): Promise<void> {
    await this.pool.query(
      'DELETE FROM api_keys WHERE user_id = $1 AND provider = $2',
      [userId, provider]
    );
  }

  async getKeysByUser(userId: number): Promise<ApiKey[]> {
    const result = await this.pool.query(
      'SELECT * FROM api_keys WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  }

  async updateUsage(userId: number, provider: string, cost: number): Promise<void> {
    await this.pool.query(
      `UPDATE api_keys
       SET last_used = NOW(), request_count = COALESCE(request_count,0) + 1,
           cost = COALESCE(cost,0) + $3
       WHERE user_id = $1 AND provider = $2`,
      [userId, provider, cost]
    );
  }
}
