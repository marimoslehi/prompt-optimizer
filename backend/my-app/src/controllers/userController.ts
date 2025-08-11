import { Request, Response } from 'express';
import { UserService } from '../services/userService';

interface AuthRequest extends Request {
  user?: { id: string };
}

export class UserController {
  private users = new UserService();

  getMe = async (req: AuthRequest, res: Response) => {
    try {
      const user = await this.users.getById(Number(req.user?.id));
      res.json({ success: true, data: { user } });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = Number(req.user?.id);
      const { name, companySize, useCase, preferences, onboardingComplete } = req.body;
      const updated = await this.users.updateProfile(userId, {
        name,
        company_size: companySize,
        use_case: useCase,
        preferences,
        onboarding_complete: onboardingComplete,
      });
      res.json({ success: true, data: { user: updated } });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  onboardingStatus = async (req: AuthRequest, res: Response) => {
    try {
      const user = await this.users.getById(Number(req.user?.id));
      res.json({ success: true, data: { completed: !!user?.onboarding_complete } });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
