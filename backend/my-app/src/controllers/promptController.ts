import { Request, Response } from 'express';

export class PromptController {
  createPrompt = async (req: Request, res: Response) => {
    try {
      const { title, content, category } = req.body;
      
      const prompt = {
        id: Date.now().toString(),
        title,
        content,
        category,
        userId: req.user?.id || '1',
        createdAt: new Date()
      };

      res.status(201).json({
        success: true,
        message: 'Prompt created successfully',
        data: { prompt }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  getPrompts = async (req: Request, res: Response) => {
    try {
      const prompts = [
        {
          id: '1',
          title: 'Marketing Analysis',
          content: 'Analyze the following marketing strategy...',
          category: 'business',
          createdAt: new Date()
        }
      ];

      res.status(200).json({
        success: true,
        data: { prompts }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  getPrompt = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const prompt = {
        id,
        title: 'Marketing Analysis',
        content: 'Analyze the following marketing strategy...',
        category: 'business',
        createdAt: new Date()
      };

      res.status(200).json({
        success: true,
        data: { prompt }
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: 'Prompt not found'
      });
    }
  };

  updatePrompt = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      res.status(200).json({
        success: true,
        message: 'Prompt updated successfully',
        data: { prompt: { id, ...updateData } }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  deletePrompt = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      res.status(200).json({
        success: true,
        message: 'Prompt deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
}
