import { DbService } from './dbService';
import { cacheService } from './cacheService';

export interface Prompt {
   id: string;
   title: string;
   content: string;
   category: string;
   userId: string;
   createdAt: Date;
   updatedAt: Date;
}

export class PromptService {
   private dbService: DbService;

   constructor() {
       this.dbService = new DbService();
   }

   public async createPrompt(data: {
       userId: string;
       title: string;
       content: string;
       category: string;
       tags?: string[];
   }): Promise<Prompt> {
       const query = `
           INSERT INTO prompts (user_id, title, content, category, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, NOW(), NOW()) 
           RETURNING id, title, content, category, user_id as "userId", created_at as "createdAt", updated_at as "updatedAt"
       `;
       
       const result = await this.dbService.query(query, [
           data.userId, 
           data.title, 
           data.content, 
           data.category
       ]);

       // Clear user's prompts cache
       await cacheService.deleteCache(`prompts:user:${data.userId}`);

       return result[0];
   }

   public async getUserPrompts(userId: string, options: {
       page?: number;
       limit?: number;
       category?: string;
       search?: string;
   } = {}): Promise<{ prompts: Prompt[]; total: number }> {
       const { page = 1, limit = 10, category, search } = options;
       const offset = (page - 1) * limit;

       // Try cache first
       const cacheKey = `prompts:user:${userId}:${page}:${limit}:${category}:${search}`;
       const cached = await cacheService.getCache(cacheKey);
       if (cached) {
           return cached;
       }

       let whereClause = 'WHERE user_id = $1';
       const params: any[] = [userId];
       let paramIndex = 2;

       if (category) {
           whereClause += ` AND category = $${paramIndex}`;
           params.push(category);
           paramIndex++;
       }

       if (search) {
           whereClause += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
           params.push(`%${search}%`);
           paramIndex++;
       }

       // Get total count
       const countQuery = `SELECT COUNT(*) FROM prompts ${whereClause}`;
       const countResult = await this.dbService.query(countQuery, params);
       const total = parseInt(countResult[0].count);

       // Get prompts
       const query = `
           SELECT id, title, content, category, user_id as "userId", 
                  created_at as "createdAt", updated_at as "updatedAt"
           FROM prompts 
           ${whereClause}
           ORDER BY created_at DESC 
           LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
       `;
       params.push(limit, offset);

       const prompts = await this.dbService.query(query, params);

       const result = { prompts, total };

       // Cache for 5 minutes
       await cacheService.setCache(cacheKey, result, 300);

       return result;
   }

   public async getPromptById(id: string, userId: string): Promise<Prompt> {
       const query = `
           SELECT id, title, content, category, user_id as "userId", 
                  created_at as "createdAt", updated_at as "updatedAt"
           FROM prompts 
           WHERE id = $1 AND user_id = $2
       `;
       
       const result = await this.dbService.query(query, [id, userId]);
       
       if (result.length === 0) {
           throw new Error('Prompt not found');
       }

       return result[0];
   }

   public async updatePrompt(id: string, userId: string, updateData: {
       title?: string;
       content?: string;
       category?: string;
   }): Promise<Prompt> {
       const fields = [];
       const values = [];
       let paramIndex = 1;

       if (updateData.title) {
           fields.push(`title = $${paramIndex}`);
           values.push(updateData.title);
           paramIndex++;
       }

       if (updateData.content) {
           fields.push(`content = $${paramIndex}`);
           values.push(updateData.content);
           paramIndex++;
       }

       if (updateData.category) {
           fields.push(`category = $${paramIndex}`);
           values.push(updateData.category);
           paramIndex++;
       }

       if (fields.length === 0) {
           throw new Error('No fields to update');
       }

       fields.push(`updated_at = NOW()`);
       values.push(id, userId);

       const query = `
           UPDATE prompts 
           SET ${fields.join(', ')}
           WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
           RETURNING id, title, content, category, user_id as "userId", 
                    created_at as "createdAt", updated_at as "updatedAt"
       `;

       const result = await this.dbService.query(query, values);

       if (result.length === 0) {
           throw new Error('Prompt not found or not authorized');
       }

       // Clear cache
       await cacheService.deleteCache(`prompts:user:${userId}`);

       return result[0];
   }

   public async deletePrompt(id: string, userId: string): Promise<void> {
       const query = 'DELETE FROM prompts WHERE id = $1 AND user_id = $2';
       const result = await this.dbService.query(query, [id, userId]);

       if (result.affectedRows === 0) {
           throw new Error('Prompt not found or not authorized');
       }

       // Clear cache
       await cacheService.deleteCache(`prompts:user:${userId}`);
   }
}

export const promptService = new PromptService();
