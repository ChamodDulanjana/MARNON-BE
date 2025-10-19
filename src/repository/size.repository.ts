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
      return await this.sizeRepository.save(size);
  }

  async getById(id: number): Promise<SizeEntity | null> {
    return await this.sizeRepository.findOne({where: { id: id }});
  }

  async getAllSizes(): Promise<SizeEntity[]> {
    return await this.sizeRepository.find();
  }

  async getAllActiveSizes(): Promise<SizeEntity[]> {
    return await this.sizeRepository.find({where: { isActive: true }});
  }

  // Check if the size name exists
  async checkSizeName(name: string): Promise<SizeEntity | null> {
    return await this.sizeRepository.findOne({where: { size: name }});
  }

  // Get sizes By pagination
  async getAllSizesByPagination(page: number, limit: number): Promise<[SizeEntity[], number]> {
    const [result, total] = await this.sizeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createDate: 'DESC', // order newest first
      },
    });

    return [result, total];
  }

  // Search sizes By pagination
  async searchSizesByPagination(searchTerm: string, page: number, limit: number): Promise<[SizeEntity[], number]> {
    const query = this.sizeRepository.createQueryBuilder('size')
      .where(
        'size.size LIKE :searchTerm ' +
        'OR size.create_by LIKE :searchTerm ' +
        'OR size.modify_by LIKE :searchTerm ' +
        'OR DATE(size.create_date) LIKE :searchTerm ' +
        'OR DATE(size.modify_date) LIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      )
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('size.create_date', 'DESC');

    const [result, total] = await query.getManyAndCount();

    return [result, total];
  }

  // Get sizes By status and pagination
  async getSizesByStatusAndPagination(isActive: boolean, page: number, limit: number): Promise<[SizeEntity[], number]> {
    const [result, total] = await this.sizeRepository.findAndCount({
      where: { isActive: isActive },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createDate: 'DESC', // order newest first
      },
    });

    return [result, total];
  }
}