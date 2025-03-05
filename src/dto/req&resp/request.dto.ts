import { IsNotEmpty, IsString } from 'class-validator';

export class RequestDTO{
  @IsNotEmpty({message: 'Email is required'})
  @IsString({message: 'Email must be a string'})
  email: string;

  @IsNotEmpty({message: 'Password is required'})
  @IsString({message: 'Password must be a string'})
  password: string;
}