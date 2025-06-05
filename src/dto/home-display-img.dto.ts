import { IsNotEmpty, IsString } from 'class-validator';

export class HomeDisplayImgDTO {
  @IsNotEmpty({message: 'Size is required'})
  @IsString({message: 'Size must be a string'})
  type: string;


  @IsNotEmpty({message: 'Size is required'})
  @IsString({message: 'Size must be a string'})
  imageUrl: string;
}