import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../entity/product.entity';
import { ProductController } from '../controller/product.controller';
import { ProductService } from '../service/product.service';
import { ProductRepository } from '../repository/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}