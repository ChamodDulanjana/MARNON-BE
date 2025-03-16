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

  async getById(id: number): Promise<ProductEntity | null> {
    return this.productRepository.findOne({
      where: { id: id },
      relations: ['category', 'productImage', 'productSize', 'review']
    });
  }

  // Check if the product name exists
  async checkProductName(name: string): Promise<ProductEntity | null> {
    return await this.productRepository.findOne({where: { name: name }});
  }

  // Check if the product description exists
  async checkProductDescription(description: string): Promise<ProductEntity | null> {
    return await this.productRepository.findOne({where: { description: description }});
  }
}