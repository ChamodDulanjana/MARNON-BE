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
    private readonly sizeRepository: SizeRepository,
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
        return new ResponseDTO(201, 'Size created successfully');
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

    // Check if the size name exists
    const bySizeName = await this.sizeRepository.checkSizeName(sizeDTO.size);
    if (bySizeName && bySizeName.id !== id) {
      throw new AlreadyExistException(['Size name already exists']);
    }

    try {
      sizeEntity.size = sizeDTO.size;
      sizeEntity.modifyBy = userName;

      await this.sizeRepository.createSize(sizeEntity);

      this.LOGGER.log(`Size updated successfully`);
      return new ResponseDTO(200, 'Size updated successfully');
    } catch (error) {
      this.LOGGER.error(`Failed to update size: ${error.message}`);
      throw error;
    }
  }

  async getById(id: number): Promise<ResponseDTO> {
    const sizeEntity = await this.sizeRepository.getById(id);
    if (!sizeEntity) {
      throw new NotFoundException(['Size not found']);
    }

    try {
      this.LOGGER.log(`Size with id ${id} found successfully`);
      return new ResponseDTO(200, `Size with id ${id} found successfully`, sizeEntity);
    } catch (error) {
      this.LOGGER.error(`Failed to find size: ${error.message}`);
      throw error;
    }
  }

  async getAllSizes(): Promise<ResponseDTO> {
    try {
      const sizeEntities = await this.sizeRepository.getAllSizes();
      this.LOGGER.log(`All sizes found successfully`);
      return new ResponseDTO(200, `All sizes found successfully`, sizeEntities);
    } catch (error) {
      this.LOGGER.error(`Failed to find sizes: ${error.message}`);
      throw error;
    }
  }

  async getAllActiveSizes(): Promise<ResponseDTO> {
    try {
      const sizeEntities = await this.sizeRepository.getAllActiveSizes();
      this.LOGGER.log(`All active sizes found successfully`);
      return new ResponseDTO(200, `All active sizes found successfully`, sizeEntities);
    } catch (error) {
      this.LOGGER.error(`Failed to find active sizes: ${error.message}`);
      throw error;
    }
  }
}