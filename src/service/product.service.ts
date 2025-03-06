import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  async createProduct(product: any): Promise<any> {
    return this.productRepository.createProduct(product);
  }
}