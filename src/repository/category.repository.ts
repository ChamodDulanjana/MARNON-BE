import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryRepository{
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {
  }

  async createCategory(category: CategoryEntity): Promise<CategoryEntity>{
    return await this.categoryRepository.save(category);
  }

  async getById(id: number): Promise<CategoryEntity | null>{
    return await this.categoryRepository.findOne({where: {id}});
  }

  async getAll(): Promise<CategoryEntity[]>{
    return await this.categoryRepository.find();
  }

  async getAllActive(): Promise<CategoryEntity[]>{
    return await this.categoryRepository.find({where: {isActive: true}});
  }

  // check if category name exists
  async findByName(name: string): Promise<CategoryEntity | null>{
    return await this.categoryRepository.findOne({where: {name}});
  }

  // search category by pagination and status
  async searchCategoryByPagination(searchTerm: string,
                                            status: 'active' | 'inactive' | 'all',
                                            page: number,
                                            limit: number, ): Promise<[CategoryEntity[], number]>{
    const query = this.categoryRepository.createQueryBuilder('category');

    // Search conditions
    query.where(
      '(category.name LIKE :searchTerm ' +
      'OR category.create_by LIKE :searchTerm ' +
      'OR category.modify_by LIKE :searchTerm ' +
      'OR DATE(category.create_date) LIKE :searchTerm ' +
      'OR DATE(category.modify_date) LIKE :searchTerm)',
      { searchTerm: `%${searchTerm}%` },
    );

    // Apply isActive filter if not all
    if (status !== 'all') {
      const isActive = status === 'active' ? 1 : 0;
      query.andWhere('category.is_active = :isActive', { isActive });
    }

    query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('category.create_date', 'DESC');

    const [result, total] = await query.getManyAndCount();

    return [result, total];
  }
}