import { UserModel, User } from '../models/user';

export class UserService {
  private model = new UserModel();

  async create(user: User): Promise<User> {
    return this.model.createUser(user);
  }

  async getById(id: number): Promise<User | null> {
    return this.model.getUserById(id);
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.model.getUserByEmail(email);
  }

  async updateProfile(id: number, data: Partial<User>): Promise<User | null> {
    return this.model.updateUser(id, data);
  }
}
