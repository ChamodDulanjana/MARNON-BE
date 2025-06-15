import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ImageTypeEnum } from '../common/enums/image_type.enum';

type ImageProps = {
  id: number | null,
  url: string,
  type: ImageTypeEnum,
}

type SizeProps = {
  id: number | null,
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

  @IsNotEmpty({message: 'Buying Price is required'})
  @IsNumber({}, {message: 'Buying Price must be a number'})
  buyingPrice: number;

  @IsNotEmpty({message: 'Selling Price is required'})
  @IsNumber({}, {message: 'Selling Price must be a number'})
  sellingPrice: number;

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