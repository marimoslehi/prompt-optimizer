import { Pool } from 'pg';

export interface User {
    id?: number;
    email: string;
    password: string;
    name?: string;
    company_size?: string;
    use_case?: string;
    preferences?: any;
    onboarding_complete?: boolean;
}

export class UserModel {
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

    async createUser(user: User): Promise<User> {
        const result = await this.pool.query(
            `INSERT INTO users (email, password, name, company_size, use_case, preferences, onboarding_complete)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                user.email,
                user.password,
                user.name || null,
                user.company_size || null,
                user.use_case || null,
                user.preferences || null,
                user.onboarding_complete ?? false,
            ]
        );
        return result.rows[0];
    }

    async getUserById(id: number): Promise<User | null> {
        const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows.length ? result.rows[0] : null;
    }

    async getAllUsers(): Promise<User[]> {
        const result = await this.pool.query('SELECT * FROM users');
        return result.rows;
    }

    async updateUser(id: number, user: Partial<User>): Promise<User | null> {
        const fields = Object.keys(user).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = Object.values(user);
        const result = await this.pool.query(
            `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
            [id, ...values]
        );
        return result.rows.length ? result.rows[0] : null;
    }

    async deleteUser(id: number): Promise<void> {
        await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    }
}