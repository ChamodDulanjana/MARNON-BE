import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ImageTypeEnum } from '../common/enums/image_type.enum';

type ImageProps = {
  url: string,
  type: ImageTypeEnum,
}

type SizeProps = {
  sizeId: number,
  qty: number,
}

export class ProductDTO{
  @IsNotEmpty({message: 'Name is required'})
  @IsString({message: 'Name must be a string'})
  name: string;

  @IsNotEmpty({message: 'Description is required'})
  @IsString({message: 'Description must be a string'})
  description: string;

  @IsNotEmpty({message: 'Image is required'})
  @IsArray({message: 'Image must be an array'})
  image: ImageProps[];

  @IsNotEmpty({message: 'Old Price is required'})
  @IsNumber({}, {message: 'Old Price must be a number'})
  oldPrice: number;

  @IsNotEmpty({message: 'New Price is required'})
  @IsNumber({}, {message: 'New Price must be a number'})
  newPrice: number;

  @IsNotEmpty({message: 'Color is required'})
  @IsString({message: 'Color must be a string'})
  color: string;

  @IsNotEmpty({message: 'Size & QTY is required'})
  @IsArray({message: 'Size & QTY must be an array'})
  size: SizeProps[];

  @IsNotEmpty({message: 'Category is required'})
  @IsArray({message: 'Category must be an array'})
  @IsNumber({}, {each: true, message: 'Category must be a number'})
  categoryIds: number[];
}