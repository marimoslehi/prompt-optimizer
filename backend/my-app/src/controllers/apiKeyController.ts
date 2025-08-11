import { Request, Response } from 'express';
import { ApiKeyService } from '../services/apiKeyService';

interface AuthRequest extends Request {
  user?: { id: string };
}

export class ApiKeyController {
  private service = new ApiKeyService();

  addOrUpdateKey = async (req: AuthRequest, res: Response) => {
    try {
      const userId = Number(req.user?.id);
      const { provider, key } = req.body;
      if (!provider || !key) {
        return res.status(400).json({ success: false, message: 'provider and key required' });
      }
      await this.service.addOrUpdateKey(userId, provider, key);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  };

  deleteKey = async (req: AuthRequest, res: Response) => {
    try {
      const userId = Number(req.user?.id);
      const { provider } = req.params;
      await this.service.deleteKey(userId, provider);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  };

  getAvailableModels = async (req: AuthRequest, res: Response) => {
    try {
      const userId = Number(req.user?.id);
      const models = await this.service.getAvailableModels(userId);
      res.json({ success: true, data: models });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to get models' });
    }
  };

  getKeyStatus = async (req: AuthRequest, res: Response) => {
    try {
      const userId = Number(req.user?.id);
      const status = await this.service.getKeyStatus(userId);
      res.json({ success: true, data: status });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to get key status' });
    }
  };
}
