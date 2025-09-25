import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeDisplayImagesEntity } from '../entity/home_display_images.entity';
import { HomeDisplayImgService } from '../service/home_display_img.service';
import { HomeDisplayImgRepository } from '../repository/home_display_img.repository';
import { HomeDisplayImgController } from '../controller/home-display-img.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([HomeDisplayImagesEntity]), // Import User Entity
  ],
  providers: [HomeDisplayImgService, HomeDisplayImgRepository], // Import Service and Repository
  controllers: [HomeDisplayImgController], // Import Controller
  //exports: [], // Export
})
export class HomeDisplayImgModule {}