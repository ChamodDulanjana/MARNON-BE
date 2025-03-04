import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './common_attribute/base.entity';
import { UserProductEntity } from './user_product.entity';
import { Exclude } from 'class-transformer';

@Entity('product')
export class ProductEntity extends BaseEntity{
  @Column({name: 'name'})
  name: string;

  @Column({name: 'description', type: 'longtext'})
  description: string;

  @Column({name: 'image', type: 'longtext'})
  image: string;

  @Column({name: 'old_price'})
  oldPrice: number;

  @Column({name: 'new_price'})
  newPrice: number;

  @OneToMany(() => UserProductEntity, userProduct => userProduct.product, {cascade: true})
  @Exclude()
  userProduct: UserProductEntity[];
}