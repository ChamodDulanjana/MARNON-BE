import { IsString } from "class-validator";

export class FilterProductDTO {
  @IsString({ message: 'SortBy term must be a string' })
  sortBy: 'newest' | 'priceLowToHigh' | 'priceHighToLow' | 'popularity';

  @IsString({message: 'Size term must be a string'})
  size?: string;

  @IsString({message: 'Color term must be a string'})
  color?: string;

  @IsString({ message: 'Category term must be a string' })
  categoryName?: 'men' | 'women' | 'kid';
}
