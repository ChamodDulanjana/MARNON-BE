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
    return this.categoryRepository.save(category);
  }

  async getById(id: number): Promise<CategoryEntity | null>{
    return this.categoryRepository.findOne({where: {id}});
  }

  async getAll(): Promise<CategoryEntity[]>{
    return this.categoryRepository.find();
  }

  async getAllActive(): Promise<CategoryEntity[]>{
    return this.categoryRepository.find({where: {isActive: true}});
  }

  // check if category name exists
  async findByName(name: string): Promise<CategoryEntity | null>{
    return this.categoryRepository.findOne({where: {name}});
  }
}