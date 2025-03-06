import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './common_attribute/base.entity';
import { UserProductEntity } from './user_product.entity';
import { Exclude } from 'class-transformer';
import { ProductCategoryEntity } from './product_category.entity';
import { ProductSizeEntity } from './product_size.entity';
import { ReviewEntity } from './review.entity';
import { ProductImageEntity } from './product_image.entity';

@Entity('product')
export class ProductEntity extends BaseEntity{
  @Column({name: 'name'})
  name: string;

  @Column({name: 'description', type: 'longtext'})
  description: string;

  @Column({name: 'old_price'})
  oldPrice: number;

  @Column({name: 'new_price'})
  newPrice: number;

  @OneToMany(() => UserProductEntity, userProduct => userProduct.product, {cascade: true})
  @Exclude()
  userProduct: UserProductEntity[];

  @OneToMany(() => ProductCategoryEntity, productCategory => productCategory.product, {cascade: true})
  @Exclude()
  productCategory: ProductCategoryEntity[];

  @OneToMany(() => ProductSizeEntity, productSize => productSize.product, {cascade: true})
  @Exclude()
  productSize: ProductSizeEntity[];

  @OneToMany(() => ReviewEntity, review => review.product, {cascade: true})
  @Exclude()
  review: ReviewEntity[];

  @OneToMany(() => ProductImageEntity, productImage => productImage.product, {cascade: true})
  @Exclude()
  productImage: ProductImageEntity[];
}