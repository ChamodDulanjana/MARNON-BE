import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './common_attribute/base.entity';
import { ProductCategoryEntity } from './product_category.entity';
import { Exclude } from 'class-transformer';

@Entity('category')
export class CategoryEntity extends BaseEntity{
    @Column({name: 'name'})
    name: string;

    @OneToMany(() => ProductCategoryEntity, productCategory => productCategory.category, {cascade: true})
    @Exclude()
    productCategory: ProductCategoryEntity[];
}