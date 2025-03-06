import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductRepository{
  constructor(
    @InjectRepository(ProductEntity)  // Injecting the repository
    private readonly productRepository: Repository<ProductEntity>
  ) {
  }

  async createProduct(product: ProductEntity): Promise<ProductEntity> {
      return this.productRepository.save(product);
  }
}