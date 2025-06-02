import { IsNotEmpty, IsString } from 'class-validator';
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

  @IsNotEmpty({message: 'Role is required'})
  @IsString({message: 'Role must be a string'})
  role: RoleEnum;
}