import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from '../common/enums/role.enum';

export class UserUpdateDTO{
  @IsNotEmpty({message: 'Name is required'})
  @IsString({message: 'Name must be a string'})
  name: string;

  @IsNotEmpty({message: 'Contact is required'})
  @IsString({message: 'Contact must be a string'})
  contact: string;

  @IsNotEmpty({message: 'Address is required'})
  @IsString({message: 'Address must be a string'})
  address: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @IsOptional()
  @IsString({message: 'Postal Code must be a string'})
  postalCode?: string;

  @IsOptional()
  @IsString({message: 'Role must be a string'})
  role: RoleEnum;
}