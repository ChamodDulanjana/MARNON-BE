import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { CategoryService } from '../service/category.service';
import { CategoryController } from '../controller/category.controller';
import { CategoryRepository } from '../repository/category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]), // Import User Entity
  ],
  providers: [CategoryService, CategoryRepository], // Import Service and Repository
  controllers: [CategoryController], // Import Controller
  exports: [CategoryRepository], // Export Repository
})
export class CategoryModule{}