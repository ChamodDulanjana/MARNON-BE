import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SizeRepository } from '../repository/size.repository';
import { SizeDTO } from '../dto/size.dto';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { AlreadyExistException } from '../common/exception/alreadyExist.exception';
import { SizeEntity } from '../entity/size.entity';

@Injectable()
export class SizeService{
  private readonly LOGGER = new Logger(SizeService.name);

  constructor(
    private readonly sizeRepository: SizeRepository
  ) {
  }

  async createSize(sizeDTO: SizeDTO, userName: string): Promise<ResponseDTO> {
      if (await this.sizeRepository.checkSizeName(sizeDTO.size)) {
        throw new AlreadyExistException(['Size name already exists']);
      }

      try {
        const sizeEntity = new SizeEntity();
        sizeEntity.size = sizeDTO.size;
        sizeEntity.isActive = true;
        sizeEntity.createBy = userName;

        await this.sizeRepository.createSize(sizeEntity);

        this.LOGGER.log(`Size created successfully`);
        return new ResponseDTO(201, 'Size created successfully', sizeDTO);
      } catch (error) {
        this.LOGGER.error(`Failed to create size: ${error.message}`);
        throw error;
      }
  }

  async updateSize(id: number, sizeDTO: SizeDTO, userName: string): Promise<ResponseDTO> {
    const sizeEntity = await this.sizeRepository.getById(id);
    if (!sizeEntity) {
      throw new NotFoundException(['Size not found']);
    }
  }
}