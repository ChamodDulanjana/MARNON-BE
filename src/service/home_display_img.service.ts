import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HomeDisplayImgRepository } from '../repository/home_display_img.repository';
import { HomeDisplayImagesEntity } from '../entity/home_display_images.entity';
import { HomeDisplayImgDTO } from '../dto/home-display-img.dto';
import { ResponseDTO } from '../dto/req&resp/response.dto';

@Injectable()
export class HomeDisplayImgService{
  private readonly LOGGER = new Logger(HomeDisplayImgService.name);

  constructor(
    private readonly homeDisplayImgRepository: HomeDisplayImgRepository,
  ) {
  }

  async createOrUpdateHomeDisplayImg(homeDisplayImgDTO: HomeDisplayImgDTO, userName: string): Promise<ResponseDTO> {
    const { type, imageUrl } = homeDisplayImgDTO;

    if (type !== 'hero' && type !== 'men' && type !== 'women' && type !== 'kids') {
      this.LOGGER.error(`Invalid type provided: ${type}`);
      throw new BadRequestException('Invalid type provided. Valid types are: hero, men, women, kids');
    }

    try {
      const byType = await this.homeDisplayImgRepository.getByType(type);

      if (byType){
        byType.imageUrl = imageUrl;
        byType.modifyBy = userName;

        await this.homeDisplayImgRepository.createHomeDisplayImg(byType);
        this.LOGGER.log(`Home display image updated successfully for type: ${type}`);
        return new ResponseDTO(200, `Home display image updated successfully for type: ${type}`);

      }

      const homeDisplayImgEntity = new HomeDisplayImagesEntity();
      homeDisplayImgEntity.type = type;
      homeDisplayImgEntity.imageUrl = imageUrl;
      homeDisplayImgEntity.isActive = true;
      homeDisplayImgEntity.createBy = userName;

      await this.homeDisplayImgRepository.createHomeDisplayImg(homeDisplayImgEntity);

      this.LOGGER.log(`Home display image created successfully`);
      return new ResponseDTO(201, 'Home display image created successfully');
    } catch (error) {
      this.LOGGER.error(`Failed to create home display image: ${error.message}`);
      throw error;
    }
  }

  async getHomeDisplayImgByType(type: string): Promise<ResponseDTO> {
    if (type !== 'hero' && type !== 'men' && type !== 'women' && type !== 'kids') {
      this.LOGGER.error(`Invalid type provided: ${type}`);
      throw new BadRequestException('Invalid type provided. Valid types are: hero, men, women, kids');
    }

    try {
      const byType = await this.homeDisplayImgRepository.getByType(type);

      if (!byType) {
        this.LOGGER.warn(`No home display image found for type: ${type}`);
        return new ResponseDTO(200, `No home display image found for type: ${type}`);
      }

      const byTypeResponse = {
        type: byType.type,
        imageUrl: byType.imageUrl,
      }

      this.LOGGER.log(`Home display image retrieved successfully for type: ${type}`);
      return new ResponseDTO(200, 'Home display image retrieved successfully', byTypeResponse);
    } catch (error) {
      this.LOGGER.error(`Failed to retrieve home display image: ${error.message}`);
      throw error;
    }
  }
}