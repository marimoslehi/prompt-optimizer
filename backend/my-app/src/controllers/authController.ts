// backend/my-app/src/controllers/authController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Password validation function
function validatePassword(password: string): string[] {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&* etc.)');
  }
  
  const commonPasswords = [
    'password', 'password123', '123456', '123456789', 'qwerty', 
    'abc123', 'password1', 'admin', 'letmein', 'welcome'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more secure password');
  }
  
  return errors;
}

export class AuthController {
  register = async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      console.log('📝 Attempting to save user to database:', email);

      // Validate required fields
      if (!email || !name || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email, name, and password are required'
        });
      }

      // Enhanced password validation
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Password requirements not met',
          errors: passwordErrors
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid email address'
        });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        console.log('❌ User already exists:', email);
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Hash password before saving
      console.log('🔐 Hashing password...');
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Split name into firstName and lastName
      const nameParts = (name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create user in database with hashed password
      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
        }
      });

      console.log('✅ User saved to database with hashed password:', user.id, user.email);

      // Generate real JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      // Return user data (WITHOUT password) and indicate it's a first login
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
          },
          token,
          isFirstLogin: true // Always true for new registrations
        }
      });

    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      if (error.code === 'P2002') {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Registration failed: ' + error.message
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      console.log('🔐 Attempting login for:', email);

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if user registered with Google OAuth (no password)
      if (!user.password) {
        return res.status(401).json({
          success: false,
          message: 'Please sign in with Google'
        });
      }

      console.log('✅ User found, verifying password for:', user.email);

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        console.log('❌ Invalid password for:', email);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      console.log('✅ Password verified, login successful for:', user.email);

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
          },
          token,
          isFirstLogin: false // Always false for existing user logins
        }
      });

    } catch (error: any) {
      console.error('❌ Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed: ' + error.message
      });
    }
  };

  // Google OAuth initiation
  googleAuth = async (req: Request, res: Response) => {
    try {
      console.log('🔗 Initiating Google OAuth...');
      
      // Generate Google OAuth URL
      const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ];

      const authUrl = googleClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: 'random-state-string', // Add CSRF protection
      });

      console.log('✅ Generated Google OAuth URL:', authUrl);

      // Redirect user to Google OAuth consent screen
      res.redirect(authUrl);

    } catch (error: any) {
      console.error('❌ Google OAuth initiation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initiate Google OAuth: ' + error.message
      });
    }
  };

  // Google OAuth callback
  googleCallback = async (req: Request, res: Response) => {
    try {
      const { code, state, error } = req.query;

      console.log('🔄 Processing Google OAuth callback...');

      // Handle OAuth error
      if (error) {
        console.log('❌ OAuth error:', error);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/sign-in?error=oauth_cancelled`);
      }

      // Validate required parameters
      if (!code) {
        console.log('❌ No authorization code received');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/sign-in?error=oauth_failed`);
      }

      // Exchange authorization code for tokens
      const { tokens } = await googleClient.getToken(code as string);
      googleClient.setCredentials(tokens);

      // Get user info from Google
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
        maxExpiry: 86400 // 24 hours
      });

      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new Error('Invalid Google token payload');
      }

      const { sub: googleId, email, given_name: firstName, family_name: lastName, picture } = payload;

      console.log('✅ Google user info received:', { email, googleId, firstName, lastName });

      // Find existing user first
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email! },
            { googleId: googleId }
          ]
        }
      });

      let user;
      let isFirstLogin = false;

      if (existingUser) {
        // Update existing user with Google ID if not set
        if (!existingUser.googleId) {
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: { googleId }
          });
        } else {
          user = existingUser;
        }
        console.log('✅ Existing user found and updated:', user.email);
        isFirstLogin = false; // Existing user
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: email!,
            googleId,
            firstName: firstName || '',
            lastName: lastName || '',
            // No password for OAuth users
          }
        });
        console.log('✅ New Google user created:', user.email);
        isFirstLogin = true; // New user
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      console.log('✅ JWT token generated for Google user:', user.email, 'First login:', isFirstLogin);

      // Redirect to frontend with token and first login flag
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&firstLogin=${isFirstLogin}`);

    } catch (error: any) {
      console.error('❌ Google OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/sign-in?error=oauth_failed`);
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      console.log('👤 Getting profile for user:', userId);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          company: true,
          role: true,
          googleId: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!user) {
        console.log('❌ User not found in database:', userId);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log('✅ Profile found:', user.email);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company,
            role: user.role,
            isGoogleUser: !!user.googleId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      });

    } catch (error: any) {
      console.error('❌ Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile: ' + error.message
      });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const userEmail = req.user?.email;

      if (!userId || !userEmail) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      const token = jwt.sign(
        { userId, email: userEmail },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { token }
      });

    } catch (error: any) {
      console.error('❌ Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Token refresh failed: ' + error.message
      });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'New password requirements not met',
          errors: passwordErrors
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user signed up with Google (no password)
      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change password for Google OAuth users'
        });
      }

      const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password);

      if (!isValidCurrentPassword) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });

      console.log('✅ Password changed successfully for user:', user.email);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error: any) {
      console.error('❌ Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password: ' + error.message
      });
    }
  };
}