import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import { User as UserDocument } from './user.schema';
import { CreateUserInput, UpdateUserInput } from './user.input';
import { Types } from 'mongoose';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { nullable: true })
  async getUserById(@Args('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput) {
    return this.userService.createUser(data);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UpdateUserInput,
  ) {
    return this.userService.updateUser(id, data);
  }

  @ResolveField('id', () => ID)
  getID(@Parent() user: UserDocument) {
    return String(user._id);
  }

  @ResolveField('referredBy', () => User, { nullable: true })
  getReferredBy(@Parent() user: UserDocument) {
    if (user.referredBy)
      return this.userService.getUserById(String(user.referredBy));
  }

  @ResolveField('referrals', () => [User], { nullable: true })
  getReferrals(@Parent() user: UserDocument) {
    if (user.referrals)
      return user.referrals.map(
        async (u) => await this.userService.getUserById(u),
      );
  }
}
