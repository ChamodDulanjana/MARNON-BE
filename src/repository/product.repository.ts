import { Injectable } from '@nestjs/common';
import { DataSource, Filter, In, Repository } from 'typeorm';
import { ProductEntity } from '../entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterProductDTO } from 'src/dto/filterProduct.dto';
import { PaginationDTO } from '../dto/pagination.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity) // Injecting the repository
    private readonly productRepository: Repository<ProductEntity>,
    private readonly dataSource: DataSource, // Injecting the data source
  ) {}

  async createProduct(product: ProductEntity): Promise<ProductEntity> {
    return await this.productRepository.save(product);
  }

  async getById(id: number): Promise<ProductEntity | null> {
    return await this.productRepository.findOne({
      where: { id: id },
      relations: [
        'productCategory',
        'productCategory.category',
        'productImage',
        'productSize',
        'productSize.size',
        'review',
      ],
    });
  }

  // Check if the product name exists
  async checkProductName(name: string): Promise<ProductEntity | null> {
    return await this.productRepository.findOne({ where: { name: name } });
  }

  // Check if the product description exists
  async checkProductDescription(description: string): Promise<ProductEntity | null> {
    return await this.productRepository.findOne({
      where: { description: description },
    });
  }

  // Get all products
  async getAllProducts(): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      relations: [
        'productCategory',
        'productCategory.category',
        'productImage',
        'productSize',
        'productSize.size',
        'review',
      ],
    });
  }

  // Get all MENs products
  async findProductsByCategory(category: string): Promise<ProductEntity[]> {
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

    // Step 1: Get IDs of products that are linked to 'Men, Women or Kid'
    const productIds = (
      await this.productRepository
        .createQueryBuilder('product')
        .innerJoin('product.productCategory', 'productCategory')
        .innerJoin('productCategory.category', 'category')
        .where('category.name = :name', { name: category })
        .select('product.id')
        .getMany()
    ).map((p) => p.id);

    // Step 2: Load full data for those products
    return await this.productRepository.find({
      where: { id: In(productIds) },
      relations: [
        'productCategory',
        'productCategory.category',
        'productImage',
        'productSize',
        'productSize.size',
        'review',
      ],
    });
  }

  // Get products by filter
  async getFilteredProducts(filterProductDTO: FilterProductDTO): Promise<ProductEntity[]> {
    const { sortBy, size, color, categoryName } = filterProductDTO;

    const query = this.productRepository.createQueryBuilder('product')
      .innerJoin('product.productCategory', 'productCategory')
      .innerJoin('productCategory.category', 'category')
      .leftJoin('product.productSize', 'productSize')
      .leftJoin('productSize.size', 'size')
      .leftJoin('product.userProduct', 'userProduct') // Assuming you have a UserProduct entity for popularity
      .where('category.name = :name', { name: categoryName })
      .andWhere('product.isActive = :isActive', { isActive: true });

    if (size) {
      query.andWhere('size.size = :size', { size });
      query.andWhere('productSize.isActive = :isActive', { isActive: true });
    }

    if (color) {
      query.andWhere('product.color = :color', { color });
    }

    if (sortBy) {
      switch (sortBy) {
        case 'newest':
          query.orderBy('product.createDate', 'DESC');
          break;
        case 'priceLowToHigh':
          query.orderBy('product.newPrice', 'ASC');
          break;
        case 'priceHighToLow':
          query.orderBy('product.newPrice', 'DESC');
          break;
      }
    }

    if (sortBy !== 'popularity') {
      return await query
        .leftJoinAndSelect('product.productImage', 'productImage')
        .getMany();
    } else {
      const popularityResults = await query
        .select('product.id', 'id')
        .addSelect('COUNT(userProduct.id)', 'popularity')
        .groupBy('product.id')
        .orderBy('popularity', 'DESC')
        .getRawMany();

      const orderedIds = popularityResults.map((r) => r.id);

      return await this.productRepository.find({
        where: { id: In(orderedIds) },
        relations: ['productImage'],
      });
    }
  }

  // Get products by category and count
  async getProductsByCategoryAndCount(category: string, count: number): Promise<ProductEntity[]> {
    return await this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.productCategory', 'productCategory')
      .leftJoinAndSelect('productCategory.category', 'category')
      .leftJoinAndSelect('product.productImage', 'productImage')
      .leftJoinAndSelect('product.productSize', 'productSize')
      .leftJoinAndSelect('productSize.size', 'size')
      .where('category.name = :categoryName', { categoryName: category })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .take(count)
      .getMany();
  }

  async getPopularProductsForAdmin(paginationDTO: PaginationDTO): Promise<any> {
    const { page, limit } = paginationDTO;
    const offset = (page - 1) * limit;

    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.userProduct', 'userProduct')
      .leftJoinAndSelect('product.productCategory', 'productCategory')
      .leftJoinAndSelect('productCategory.category', 'category')
      .where('product.isActive = :isActive', { isActive: true })
      .groupBy('product.id')
      .addGroupBy('productCategory.id')
      .addGroupBy('category.id')
      .addGroupBy('productCategory.product')
      .select([
        'product',
        'productCategory',
        'category',
      ])
      .addSelect('COUNT(userProduct.id)', 'userProductCount')
      .orderBy('userProductCount', 'DESC');

    // Clone the query for count
    const total = await query.getCount();

    // Apply pagination
    const paginated = await query
      .skip(offset)
      .take(limit)
      .getRawAndEntities();

    return {
      productEntities: paginated.entities,
      totalRows: total,
    };
  }

  async getSalesByProductId(productId: number): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COUNT(*) as salesCount
        FROM user_product
        WHERE product_id = ?
        AND is_active = true
      `, [productId],
    );

    return parseInt(result[0].salesCount, 10);
  }
}