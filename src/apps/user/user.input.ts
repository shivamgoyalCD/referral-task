import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @MinLength(5, { message: 'Username must be at least 5 characters long' })
  username: string;

  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  parentId?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Username must be at least 5 characters long' })
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  wallet?: number;
}
