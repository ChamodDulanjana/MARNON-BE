import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ImageTypeEnum } from '../common/enums/image_type.enum';

export class ProductDTO{
  @IsNotEmpty({message: 'Name is required'})
  @IsString({message: 'Name must be a string'})
  name: string;

  @IsNotEmpty({message: 'Description is required'})
  @IsString({message: 'Description must be a string'})
  description: string;

  @IsNotEmpty({message: 'Image is required'})
  @IsArray({message: 'Image must be an array'})
  @ValidateNested()
  image: {
    url: string,
    type: ImageTypeEnum,
  }[];

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
  @ValidateNested()
  data: {
    size: string;
    qty: number;
  }[];

  @IsNotEmpty({message: 'Category is required'})
  @IsArray({message: 'Category must be an array'})
  @IsString({each: true, message: 'Category must be a string'})
  category: string[];
}