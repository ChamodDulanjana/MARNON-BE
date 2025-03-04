import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './common_attribute/base.entity';
import { ProductSizeEntity } from './product_size.entity';
import { Exclude } from 'class-transformer';

@Entity('size')
export class SizeEntity extends BaseEntity {
  @Column({ name: 'size' })
  size: string;

  @OneToMany(() => ProductSizeEntity, productSize => productSize.size, { cascade: true })
  @Exclude()
  productSize: ProductSizeEntity[];
}