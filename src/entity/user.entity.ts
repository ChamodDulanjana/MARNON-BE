import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './common_attribute/base.entity';
import { RoleEnum } from '../common/enums/role.enum';
import { OrderEntity } from './order.entity';
import { Exclude } from 'class-transformer';
import { ReviewEntity } from './review.entity';

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

  @Column({name: 'city', nullable: true})
  city: string;

  @Column({name: 'postal_code', nullable: true})
  postalCode: string;

  @Column({name: 'role', type: 'enum', enum: RoleEnum})
  role: RoleEnum;

  @OneToMany(() => OrderEntity, order => order.user, {cascade: true})
  @Exclude()
  order: OrderEntity[];

  @OneToMany(() => ReviewEntity, review => review.user, {cascade: true})
  @Exclude()
  review: ReviewEntity[];
}