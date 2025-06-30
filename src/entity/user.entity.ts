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

  @Column({name: 'street_address', type: 'longtext'})
  streetAddress: string;

  @Column({name: 'town_or_city', nullable: true})
  townOrCity: string;

  @Column({name: 'province_or_state', nullable: true})
  provinceOrState: string;

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