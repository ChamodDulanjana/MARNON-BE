import { BaseEntity } from './common_attribute/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('home_display_images')
export class HomeDisplayImagesEntity extends BaseEntity{
    @Column({name: 'type'})
    type: string;

    @Column({name: 'image_url'})
    imageUrl: string;
}