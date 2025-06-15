import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProductEntity } from '../entity/user_product.entity';
import { UserProductService } from '../service/user_product.service';
import { UserProductRepository } from '../repository/user_product.repository';
import { UserProductController } from '../controller/user_product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProductEntity]), // Import UserProductEntity
  ],
  providers: [UserProductService, UserProductRepository], // Import UserProductService and UserProductRepository
  controllers: [UserProductController], // Import UserProductController
  exports: [],
})
export class UserProductModule {}