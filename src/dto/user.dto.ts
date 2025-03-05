import { RoleEnum } from '../common/enums/role.enum';

export class UserDTO{
  name: string;
  email: string;
  password: string;
  contact: string;
  address: string;
  role: RoleEnum;
}