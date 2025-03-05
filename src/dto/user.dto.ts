import { RoleEnum } from '../common/enums/role.enum';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDTO{
  @IsNotEmpty({message: 'Name is required'})
  @IsString({message: 'Name must be a string'})
  name: string;

  @IsNotEmpty({message: 'Email is required'})
  @IsString({message: 'Email must be a string'})
  email: string;

  @IsNotEmpty({message: 'Password is required'})
  @IsString({message: 'Password must be a string'})
  password: string;

  @IsNotEmpty({message: 'Contact is required'})
  @IsString({message: 'Contact must be a string'})
  contact: string;

  @IsNotEmpty({message: 'Address is required'})
  @IsString({message: 'Address must be a string'})
  address: string;

  @IsNotEmpty({message: 'Role is required'})
  @IsString({message: 'Role must be a string'})
  role: RoleEnum;
}