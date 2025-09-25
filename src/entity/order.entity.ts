import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { Exclude } from 'class-transformer';
import { ProductEntity } from './product.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn({ name: 'create_date', type: 'timestamp', nullable: false })
  createDate: Date;

  @Column({ name: 'payment_method', type: 'varchar' })
  paymentMethod: string;

  @Column({ name: 'payment_status', type: 'varchar' })
  paymentStatus: string

  @Column({ name: 'order_status', type: 'varchar' })
  orderStatus: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => UserEntity, (user) => user.order)
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.order)
  @JoinColumn({ name: 'product_id' })
  @Exclude()
  product: ProductEntity;
}