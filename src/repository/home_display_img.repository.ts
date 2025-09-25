import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeDisplayImagesEntity } from '../entity/home_display_images.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HomeDisplayImgRepository{
  constructor(
    @InjectRepository(HomeDisplayImagesEntity)
    private readonly homeDisplayImgRepository: Repository<HomeDisplayImagesEntity>// Injecting the repository
  ) {
  }

  async createHomeDisplayImg(homeDisplayImg: HomeDisplayImagesEntity): Promise<HomeDisplayImagesEntity> {
    return await this.homeDisplayImgRepository.save(homeDisplayImg);
  }

  async getById(id: number): Promise<HomeDisplayImagesEntity | null> {
    return await this.homeDisplayImgRepository.findOne({
      where: { id: id }
    });
  }

  async getAllHomeDisplayImgs(): Promise<HomeDisplayImagesEntity[]> {
    return await this.homeDisplayImgRepository.find();
  }

  async getByType(type: string): Promise<HomeDisplayImagesEntity | null> {
    return await this.homeDisplayImgRepository.findOne({
      where: { type: type }
    });
  }
}