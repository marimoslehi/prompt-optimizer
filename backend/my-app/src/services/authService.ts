import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { UserService } from './userService';

export class AuthService {
  private secretKey: string;
  private users = new UserService();

  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'your_secret_key';
  }

  async register(userData: { email: string; password: string; name?: string }): Promise<{ user: User; token: string }> {
    const existing = await this.users.getByEmail(userData.email);
    if (existing) {
      throw new Error('Email already in use');
    }
    const hashed = await bcrypt.hash(userData.password, 10);
    const user = await this.users.create({
      email: userData.email,
      password: hashed,
      name: userData.name,
      onboarding_complete: false,
    });
    const token = this.generateToken(user);
    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    const user = await this.users.getByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = this.generateToken(user);
      return { user, token };
    }
    return null;
  }

  public generateToken(user: User): string {
    const payload = { id: user.id, email: user.email, name: user.name };
    return jwt.sign(payload, this.secretKey, { expiresIn: '7d' });
  }
}