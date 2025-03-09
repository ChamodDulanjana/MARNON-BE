import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { Exclude } from 'class-transformer';
import { SizeEntity } from './size.entity';

@Entity('product_size')
export class ProductSizeEntity{
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'qty'})
  qty: number;

  @ManyToOne(() => ProductEntity, (product) => product.productSize)
  @JoinColumn({ name: 'product_id' })
  @Exclude()
  product: ProductEntity;

  @ManyToOne(() => SizeEntity, (size) => size.productSize)
  @JoinColumn({ name: 'size_id' })
  @Exclude()
  size: SizeEntity;
}