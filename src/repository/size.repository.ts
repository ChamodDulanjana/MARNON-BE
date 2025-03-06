import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SizeEntity } from '../entity/size.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SizeRepository{
  constructor(
    @InjectRepository(SizeEntity)  // Injecting the repository
    private readonly sizeRepository: Repository<SizeEntity>
  ) {
  }

  async createSize(size: SizeEntity): Promise<SizeEntity> {
      return this.sizeRepository.save(size);
  }

  async getById(id: number): Promise<SizeEntity | null> {
    return this.sizeRepository.findOne({where: { id: id }});
  }

  // Check if the size name exists
  async checkSizeName(name: string): Promise<SizeEntity | null> {
    return await this.sizeRepository.findOne({where: { size: name }});
  }
}