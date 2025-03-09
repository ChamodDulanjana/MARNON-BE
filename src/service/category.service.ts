import { Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';
import { CategoryDTO } from '../dto/category.dto';
import { AlreadyExistException } from '../common/exception/alreadyExist.exception';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { CategoryEntity } from '../entity/category.entity';
import { NotFoundException } from '../common/exception/notFound.exception';

type CategoryGet = {
  id: number;
  name: string;
  isActive: boolean;
  createBy: string;
  modifyBy: string;
  createDate: Date;
  modifyDate: Date;
}

@Injectable()
export class CategoryService{
  private readonly LOGGER = new Logger(CategoryService.name);

  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) {
  }

  async createCategory(categoryDTO: CategoryDTO, userName: string): Promise<ResponseDTO>{
    if (await this.categoryRepository.findByName(categoryDTO.name)){
      throw new AlreadyExistException([`Category with name ${categoryDTO.name} already exists`]);
    }

    try {
      // Create a new category entity
      const categoryEntity = new CategoryEntity();
      categoryEntity.name = categoryDTO.name;
      categoryEntity.isActive = true;
      categoryEntity.createBy = userName;

      // Save the category entity
      await this.categoryRepository.createCategory(categoryEntity);

      this.LOGGER.log(`Category created successfully`);
      return new ResponseDTO(201, 'Category created successfully');
    } catch (error) {
      this.LOGGER.error('Error occurred while creating category', error.message);
      throw error;
    }
  }

  async updateCategory(id: number, categoryDTO: CategoryDTO, userName: string): Promise<ResponseDTO>{
    const categoryEntity = await this.categoryRepository.getById(id);
    if (!categoryEntity){
      throw new NotFoundException([`Category with id ${id} not found`]);
    }

    const byCategoryName = await this.categoryRepository.findByName(categoryDTO.name);
    if (byCategoryName && byCategoryName.id !== id){
      throw new AlreadyExistException([`Category with name ${categoryDTO.name} already exists`]);
    }

    try {
      categoryEntity.name = categoryDTO.name;
      categoryEntity.modifyBy = userName;

      await this.categoryRepository.createCategory(categoryEntity);

      this.LOGGER.log(`Category updated successfully`);
      return new ResponseDTO(200, 'Category updated successfully');
    } catch (error) {
      this.LOGGER.error('Error occurred while updating category', error.message);
      throw error;
    }
  }

  async getById(id: number): Promise<ResponseDTO> {
    const categoryEntity = await this.categoryRepository.getById(id);
    if (!categoryEntity) {
      throw new NotFoundException([`Category with id ${id} not found`]);
    }

    try {
      const category: CategoryGet = {
        id: categoryEntity.id,
        name: categoryEntity.name,
        isActive: categoryEntity.isActive,
        createBy: categoryEntity.createBy,
        modifyBy: categoryEntity.modifyBy,
        createDate: categoryEntity.createDate,
        modifyDate: categoryEntity.modifyDate
      }

      this.LOGGER.log(`Category retrieved successfully`);
      return new ResponseDTO(200, 'Category retrieved successfully', category);
    } catch (error) {
      this.LOGGER.error('Error occurred while retrieving category', error.message);
      throw error;
    }
  }

  async getAllCategories(): Promise<ResponseDTO> {
    const categoryEntities = await this.categoryRepository.getAll();

    try {
      const categories: CategoryGet[] = categoryEntities.map((categoryEntity) => {
        return {
          id: categoryEntity.id,
          name: categoryEntity.name,
          isActive: categoryEntity.isActive,
          createBy: categoryEntity.createBy,
          modifyBy: categoryEntity.modifyBy,
          createDate: categoryEntity.createDate,
          modifyDate: categoryEntity.modifyDate
        }
      });

      this.LOGGER.log(`Category retrieved successfully`);
      return new ResponseDTO(200, 'Category retrieved successfully', categories);
    } catch (error) {
      this.LOGGER.error('Error occurred while retrieving category', error.message);
      throw error;
    }
  }

  async getAllActiveCategories(): Promise<ResponseDTO> {
    const categoryEntities = await this.categoryRepository.getAllActive();

    try {
      const categories: CategoryGet[] = categoryEntities.map((categoryEntity) => {
        return {
          id: categoryEntity.id,
          name: categoryEntity.name,
          isActive: categoryEntity.isActive,
          createBy: categoryEntity.createBy,
          modifyBy: categoryEntity.modifyBy,
          createDate: categoryEntity.createDate,
          modifyDate: categoryEntity.modifyDate
        }
      });

      this.LOGGER.log(`Category retrieved successfully`);
      return new ResponseDTO(200, 'Category retrieved successfully', categories);
    } catch (error) {
      this.LOGGER.error('Error occurred while retrieving category', error.message);
      throw error;
    }
  }
}