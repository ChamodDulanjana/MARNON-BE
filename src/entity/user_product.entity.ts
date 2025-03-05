import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { Exclude } from 'class-transformer';
import { ProductEntity } from './product.entity';

@Entity('user_product')
export class UserProductEntity{
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => UserEntity, (user) => user.userProduct)
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.userProduct)
  @JoinColumn({ name: 'product_id' })
  @Exclude()
  product: ProductEntity;
}