import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './common_attribute/base.entity';
import { RoleEnum } from '../common/enums/role.enum';
import { UserProductEntity } from './user_product.entity';
import { Exclude } from 'class-transformer';

@Entity('user') 
export class UserEntity extends BaseEntity{
  @Column({name: 'name'})
  name: string;

  @Column({name: 'email'})
  email: string;

  @Column({name: 'username'})
  username: string;

  @Column({name: 'password', nullable: true})
  password: string;

  @Column({name: 'contact'})
  contact: string;

  @Column({name: 'address', type: 'longtext'})
  address: string;

  @Column({name: 'role', type: 'enum', enum: RoleEnum})
  role: string;

  @OneToMany(() => UserProductEntity, userProduct => userProduct.user, {cascade: true})
  @Exclude()
  userProduct: UserProductEntity[];
}