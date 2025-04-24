import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from '../entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductRepository{
  constructor(
    @InjectRepository(ProductEntity)  // Injecting the repository
    private readonly productRepository: Repository<ProductEntity>,
    private readonly dataSource: DataSource, // Injecting the data source
  ) {
  }

  async createProduct(product: ProductEntity): Promise<ProductEntity> {
      return this.productRepository.save(product);
  }

  async getById(id: number): Promise<ProductEntity | null> {
    return this.productRepository.findOne({
      where: { id: id },
      relations: ['productCategory', 'productCategory.category', 'productImage', 'productSize', 'productSize.size', 'review']
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

  // Get all products
  async getAllProducts(): Promise<ProductEntity[]> {
    return this.productRepository.find({
      relations: ['productCategory', 'productCategory.category', 'productImage', 'productSize', 'productSize.size', 'review']
    });
  }

  // Get all MENs products
  async findAllMensProducts(): Promise<ProductEntity[]> {
    const result = await this.dataSource.query(`
      SELECT p.*
      FROM product p
      INNER JOIN product_category pc ON pc.product_id = p.id
      INNER JOIN category c ON c.id = pc.category_id
      WHERE c.name = ? AND p.is_active = true
    `, ['Men']);

    return result;
  }
}