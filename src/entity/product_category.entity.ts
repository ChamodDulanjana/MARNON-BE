import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { Exclude } from 'class-transformer';
import { CategoryEntity } from './category.entity';

@Entity('product_category')
export class ProductCategoryEntity{
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => ProductEntity, (product) => product.productCategory)
  @JoinColumn({ name: 'product_id' })
  @Exclude()
  product: ProductEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.productCategory)
  @JoinColumn({ name: 'category_id' })
  @Exclude()
  category: CategoryEntity;
}