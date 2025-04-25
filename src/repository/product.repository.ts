import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
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
    /*const result = await this.dataSource.query(`
      SELECT p.*
      FROM product p
      INNER JOIN product_category pc ON pc.product_id = p.id
      INNER JOIN category c ON c.id = pc.category_id
      WHERE c.name = ? AND p.is_active = true
    `, ['Men']);

    return result;
    //----------------------------------------------------

    return this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.productCategory', 'productCategory')
      .leftJoinAndSelect('productCategory.category', 'category')
      .leftJoinAndSelect('product.productImage', 'productImage')
      .leftJoinAndSelect('product.productSize', 'productSize')
      .leftJoinAndSelect('productSize.size', 'size')
      .where('category.name = :categoryName', { categoryName: 'Men' })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getMany();
    //----------------------------------------------------

    return this.productRepository.createQueryBuilder('product')
      .leftJoin('product.productCategory', 'productCategory')
      .leftJoin('productCategory.category', 'category')
      .leftJoin('product.productImage', 'productImage')
      .leftJoin('product.productSize', 'productSize')
      .leftJoin('productSize.size', 'size')
      .addSelect([
        'product.id',
        'product.name',
        'product.description',
        'product.oldPrice',
        'product.newPrice',
        'product.color',
        'product.isActive',
        'product.createBy',
        'product.modifyBy',
        'product.createDate',
        'product.modifyDate',
        'productCategory.id',
        'category.id',
        'category.name',
        'productImage.id',
        'productImage.image',
        'productImage.type',
        'productSize.id',
        'productSize.qty',
        'size.id',
        'size.size'
      ])
      .where('category.name = :categoryName', { categoryName: 'Men' })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getRawMany();
    //----------------------------------------------------

    return await this.productRepository.find({
      where: {
        isActive: true,
        productCategory: {
          category: {
            name: 'Men',
          },
        },
      },
      relations: ['productCategory', 'productCategory.category', 'productImage', 'productSize', 'productSize.size', 'review']
    });
    //----------------------------------------------------
    */

    // Step 1: Get IDs of products that are linked to 'Men'
    const menProductIds = (await this.productRepository.createQueryBuilder('product')
      .innerJoin('product.productCategory', 'productCategory')
      .innerJoin('productCategory.category', 'category')
      .where('category.name = :name', { name: 'Men' })
      .select('product.id')
      .getMany()).map(p => p.id);

    // Step 2: Load full data for those products
    return await this.productRepository.find({
      where: { id: In(menProductIds) },
      relations: ['productCategory', 'productCategory.category', 'productImage', 'productSize', 'productSize.size', 'review']
    });
  }

  // Get all WOMENs products
  async findAllWomensProducts(): Promise<ProductEntity[]> {
    // Step 1: Get IDs of products that are linked to 'Women'
    const menProductIds = (await this.productRepository.createQueryBuilder('product')
      .innerJoin('product.productCategory', 'productCategory')
      .innerJoin('productCategory.category', 'category')
      .where('category.name = :name', { name: 'Women' })
      .select('product.id')
      .getMany()).map(p => p.id);

    // Step 2: Load full data for those products
    return await this.productRepository.find({
      where: { id: In(menProductIds) },
      relations: ['productCategory', 'productCategory.category', 'productImage', 'productSize', 'productSize.size', 'review']
    });
  }

  // Get all KIDs products
  async findAllKidsProducts(): Promise<ProductEntity[]> {
    // Step 1: Get IDs of products that are linked to 'Kids'
    const menProductIds = (await this.productRepository.createQueryBuilder('product')
      .innerJoin('product.productCategory', 'productCategory')
      .innerJoin('productCategory.category', 'category')
      .where('category.name = :name', { name: 'Kid' })
      .select('product.id')
      .getMany()).map(p => p.id);

    // Step 2: Load full data for those products
    return await this.productRepository.find({
      where: { id: In(menProductIds) },
      relations: ['productCategory', 'productCategory.category', 'productImage', 'productSize', 'productSize.size', 'review']
    });
  }
}