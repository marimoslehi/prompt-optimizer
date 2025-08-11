import crypto from 'crypto';
import fetch from 'node-fetch';
import { ApiKeyModel, ApiKey } from '../models/apiKey';

const ENCRYPTION_SECRET = process.env.API_KEY_ENCRYPTION_SECRET || 'default_secret_key_default_secret_key';
const IV_LENGTH = 16;

const PROVIDER_INFO: Record<string, {models: string[]; url: string; validate: (key: string) => Promise<boolean>;}> = {
  openai: {
    models: ['gpt-4', 'gpt-3.5-turbo'],
    url: 'https://platform.openai.com/api-keys',
    validate: async (key: string) => {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${key}` }
      });
      return res.ok;
    }
  },
  anthropic: {
    models: ['claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    url: 'https://console.anthropic.com/account/keys',
    validate: async (key: string) => {
      const res = await fetch('https://api.anthropic.com/v1/models', {
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01'
        }
      });
      return res.ok;
    }
  },
  google: {
    models: ['gemini-1.5-flash'],
    url: 'https://aistudio.google.com/app/apikey',
    validate: async (key: string) => {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
      return res.ok;
    }
  },
  groq: {
    models: ['llama3-8b-8192'],
    url: 'https://console.groq.com/keys',
    validate: async (key: string) => {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${key}` }
      });
      return res.ok;
    }
  }
};

export const MODEL_PROVIDER_MAP: Record<string, string> = {};
Object.keys(PROVIDER_INFO).forEach(p => {
  PROVIDER_INFO[p].models.forEach(m => MODEL_PROVIDER_MAP[m] = p);
});

export class ApiKeyService {
  private model = new ApiKeyModel();

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(ENCRYPTION_SECRET.slice(0,32)), iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  private decrypt(hash: string): string {
    const [ivHex, encryptedHex] = hash.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(ENCRYPTION_SECRET.slice(0,32)), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString('utf8');
  }

  async addOrUpdateKey(userId: number, provider: string, rawKey: string): Promise<ApiKey> {
    const info = PROVIDER_INFO[provider];
    if (!info) throw new Error('Unknown provider');
    const valid = await info.validate(rawKey);
    if (!valid) throw new Error('Invalid API key');
    const encrypted = this.encrypt(rawKey);
    return this.model.upsertKey({ user_id: userId, provider, key: encrypted });
  }

  async deleteKey(userId: number, provider: string): Promise<void> {
    await this.model.deleteKey(userId, provider);
  }

  private async getUserKeys(userId: number): Promise<ApiKey[]> {
    return this.model.getKeysByUser(userId);
  }

  async getDecryptedKeys(userId: number): Promise<Record<string, string>> {
    const keys = await this.getUserKeys(userId);
    const result: Record<string, string> = {};
    keys.forEach(k => {
      result[k.provider] = this.decrypt(k.key);
    });
    return result;
  }

  async getAvailableModels(userId: number): Promise<any[]> {
    const keys = await this.getUserKeys(userId);
    const models: any[] = [];
    keys.forEach(k => {
      const info = PROVIDER_INFO[k.provider];
      if (info) {
        info.models.forEach(m => models.push({ id: m, provider: k.provider }));
      }
    });
    return models;
  }

  async getKeyStatus(userId: number) {
    const keys = await this.getUserKeys(userId);
    return Object.keys(PROVIDER_INFO).map(p => {
      const key = keys.find(k => k.provider === p);
      return {
        provider: p,
        connected: !!key,
        lastUsed: key?.last_used || null,
        requestCount: key?.request_count || 0,
        cost: key?.cost || 0,
        infoUrl: PROVIDER_INFO[p].url
      };
    });
  }

  async hasAccessToModel(userId: number, model: string): Promise<boolean> {
    const provider = MODEL_PROVIDER_MAP[model];
    if (!provider) return true; // models without provider
    const keys = await this.getUserKeys(userId);
    return keys.some(k => k.provider === provider);
  }

  async recordUsage(userId: number, model: string, cost: number): Promise<void> {
    const provider = MODEL_PROVIDER_MAP[model];
    if (provider) {
      await this.model.updateUsage(userId, provider, cost);
    }
  }
}
