import { IsNotEmpty, IsString } from 'class-validator';

export class SizeDTO{
  @IsNotEmpty({message: 'Size is required'})
  @IsString({message: 'Size must be a string'})
  size: string;
}