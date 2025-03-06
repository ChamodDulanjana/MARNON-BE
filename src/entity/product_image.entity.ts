import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './common_attribute/base.entity';
import { ImageTypeEnum } from '../common/enums/image_type.enum';
import { ProductEntity } from './product.entity';
import { Exclude } from 'class-transformer';

@Entity('product_image')
export class ProductImageEntity extends BaseEntity{
  @Column({name: 'image', type: 'longtext'})
  image: string;

  @Column({name: 'type', type: 'enum', enum: ImageTypeEnum})
  type: ImageTypeEnum;

  @ManyToOne(() => ProductEntity, product => product.productImage)
  @JoinColumn({name: 'product_id'})
  @Exclude()
  product: ProductEntity;
}