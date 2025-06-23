import { RoleEnum } from '../common/enums/role.enum';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsNotEmpty({message: 'Street Address is required'})
  @IsString({message: 'Street Address must be a string'})
  streetAddress: string;

  @IsOptional()
  @IsString({ message: 'Town or City must be a string' })
  townOrCity?: string;

  @IsOptional()
  @IsString({message: 'Province or State must be a string'})
  provinceOrState?: string;

  @IsOptional()
  @IsString({message: 'Postal Code must be a string'})
  postalCode?: string;

  @IsNotEmpty({message: 'Role is required'})
  @IsString({message: 'Role must be a string'})
  role: RoleEnum;
}