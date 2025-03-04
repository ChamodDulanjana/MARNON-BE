import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './common_attribute/base.entity';
import { ProductEntity } from './product.entity';
import { Exclude } from 'class-transformer';
import { UserEntity } from './user.entity';

@Entity('review')
export class ReviewEntity extends BaseEntity{
  @Column({name: 'review'})
  review: string;

  @Column({name: 'rating'})
  rating: number;

  @ManyToOne(() => ProductEntity, product => product.review)
  @JoinColumn({name: 'product_id'})
  @Exclude()
  product: ProductEntity;

  @ManyToOne(() => UserEntity, user => user.review)
  @JoinColumn({name: 'user_id'})
  @Exclude()
  user: UserEntity;
}