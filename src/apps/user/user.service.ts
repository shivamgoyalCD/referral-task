import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type createUserInput = Partial<User> & { parentId?: string };

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(data: createUserInput): Promise<User> {
    let user: User | null = await this.userModel.findOne({ email: data.email });
    if (user) {
      throw new Error('User with this email already exists');
    }

    let userInput = data;

    const hashedPassword = await bcrypt.hash(data.password, 10);
    if (data.parentId) {
      userInput = {
        username: data.username,
        password: hashedPassword,
        email: data.email,
      };
    }
    userInput.password = hashedPassword;
    user = new this.userModel(userInput);
    let newUser = await user.save();

    if (data.parentId) {
      newUser = await this.addReferral(String(newUser._id), data.parentId);
    }

    return newUser;
  }

  async updateUser(
    id: string | Types.ObjectId,
    data: Partial<User>,
  ): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userModel.findOne({ email: data.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }

    const updates = {
      username: data.username ?? user.username,
      email: data.email ?? user.email,
      password: data.password ?? user.password,
      isActive: data.isActive ?? user.isActive,
      wallet: user.wallet + (data.wallet ?? 0),
    };

    Object.assign(user, updates);

    return user.save();
  }

  getUserById(id: string | Types.ObjectId): Promise<User | null> {
    const user = this.userModel.findById(id);
    return user;
  }

  async addReferral(childId: string, parentId: string): Promise<User> {
    if (parentId === childId) {
      throw new Error('Self-referral is not allowed');
    }

    const parent = await this.userModel.findById(parentId);
    const child = await this.userModel.findById(childId);

    if (!parent || !parent.isActive)
      throw new Error('Parent user is inactive or does not exist');
    if (!child || !child.isActive)
      throw new Error('Child user is inactive or does not exist');

    if (parent?.referrals?.length && parent.referrals.length >= 8) {
      throw new Error('Referral limit of 8 exceeded for this user');
    }

    if (
      parent?.referrals?.includes(new Types.ObjectId(childId)) ||
      child?.referredBy
    ) {
      throw new Error('This user is already referred');
    }

    const grandParent = parent.referredBy
      ? await this.userModel.findById(parent.referredBy)
      : null;
    if (
      childId === String(child.referredBy) ||
      (grandParent &&
        grandParent.referredBy &&
        childId === String(grandParent.referredBy))
    ) {
      throw new Error('Circular referral is not allowed');
    }

    parent?.referrals?.push(child?._id as Types.ObjectId);
    await parent.save();

    child.referredBy = parent._id as Types.ObjectId;
    return child.save();
  }
}
