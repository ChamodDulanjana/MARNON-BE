import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { ProductDTO } from '../dto/product.dto';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { AlreadyExistException } from '../common/exception/alreadyExist.exception';
import { NotFoundException } from '../common/exception/notFound.exception';
import { ProductEntity } from '../entity/product.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { ImageTypeEnum } from '../common/enums/image_type.enum';
import { ProductImageEntity } from '../entity/product_image.entity';
import { SizeRepository } from '../repository/size.repository';
import { ProductSizeEntity } from '../entity/product_size.entity';
import { CategoryRepository } from '../repository/category.repository';
import { ProductCategoryEntity } from '../entity/product_category.entity';

@Injectable()
export class ProductService {
  private readonly LOGGER = new Logger(ProductService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly sizeRepository: SizeRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly dataSource: DataSource, // Required for QueryRunner
  ) {}

  async createProduct(productDTO: ProductDTO, userName: string): Promise<ResponseDTO> {
    // Check if the product name exists
    if (await this.productRepository.checkProductName(productDTO.name)) {
      throw new AlreadyExistException(['Product name already exists']);
    }

    // Check if the product description exists
    if (await this.productRepository.checkProductDescription(productDTO.description)) {
      throw new AlreadyExistException(['Product description already exists']);
    }

    // ---------------------------------- Validate product images ----------------------------------

    // Null check
    if (productDTO.image === null || productDTO.image.length === 0) {
      throw new BadRequestException('Image not found');
    }

    for (const image of productDTO.image) {
      if (image.url === null || image.url === '' || image.url === undefined) {
        throw new BadRequestException('Image URL not found');
      } else if (image.type === null || image.type === undefined) {
        throw new BadRequestException('Image type not found');
      }
    }

    // Check if image array has only one MAIN image
    if (productDTO.image) {
      const mainImages = productDTO.image.filter(img => img.type === 'MAIN');
      if (mainImages.length === 0) {
        throw new BadRequestException('At least one MAIN image is required');
      }
      if (mainImages.length > 1) {
        throw new BadRequestException('Only one image can have the type ' + ImageTypeEnum.MAIN);
      }
    }

    // Limit the number of SUB images to 4
    const subImages = productDTO.image.filter(img => img.type === 'SUB');
    if (subImages.length > 4) {
      throw new BadRequestException('Maximum 4 images can have the type ' + ImageTypeEnum.SUB);
    }

    // ---------------------------------- Validate product sizes ----------------------------------

    // Null check
    if (productDTO.size === null) {
      throw new NotFoundException(['Size not found']);
    }

    const sizeIds = new Set();
    for (const size of productDTO.size) {
      if (size.sizeId === null || size.sizeId === undefined) {
        throw new BadRequestException('Size ID not found');
      } else if (size.qty === null || size.qty === undefined) {
        throw new BadRequestException('Quantity not found');
      }

      // Check if the product size duplicates
      if (sizeIds.has(size.sizeId)) {
        throw new BadRequestException('Duplicate size found');
      }
      sizeIds.add(size.sizeId);
    }

    // ---------------------------------- Validate product categories ----------------------------------

    // Null check
    if (productDTO.categoryIds === null || productDTO.categoryIds.length === 0) {
      throw new NotFoundException(['Category not found']);
    }

    // Check duplicate category
    const categoryIds = new Set();
    for (const categoryId of productDTO.categoryIds) {
      if (categoryIds.has(categoryId)) {
        throw new BadRequestException('Duplicate category found');
      }
      categoryIds.add(categoryId);
    }

    // ---------------------------------- Start Transactions ----------------------------------

    // Start a new transaction
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Build the product entity
      const productEntity = new ProductEntity();
      productEntity.name = productDTO.name;
      productEntity.description = productDTO.description;
      productEntity.oldPrice = productDTO.oldPrice;
      productEntity.newPrice = productDTO.newPrice;
      productEntity.color = productDTO.color;
      productEntity.createBy = userName;
      productEntity.isActive = true;

      // Save the product entity
      await queryRunner.manager.save(productEntity);

      // Build product image entities
      const imageEntities = productDTO.image.map((img) => {
        const productImageEntity = new ProductImageEntity();
        productImageEntity.image = img.url;
        productImageEntity.type = img.type;
        productImageEntity.product = productEntity;
        productImageEntity.createBy = userName;
        productImageEntity.isActive = true;
        return productImageEntity;
      });

      // Save product image entities
      await queryRunner.manager.save(imageEntities);

      // Build product size entities
      const sizeEntities = await Promise.all(productDTO.size.map(async (size) => {
        const sizeEntity = await this.sizeRepository.getById(size.sizeId);
        if (!sizeEntity) {
          throw new NotFoundException(['Size not found']);
        }

        const productSizeEntity = new ProductSizeEntity();
        productSizeEntity.product = productEntity;
        productSizeEntity.size = sizeEntity;
        productSizeEntity.qty = size.qty;
        productSizeEntity.isActive = true;

        return productSizeEntity;
      }));

      // Save product size entities
      await queryRunner.manager.save(sizeEntities);

      // Build product category entities
      const categoryEntities = await Promise.all(productDTO.categoryIds.map(async (categoryId) => {
        const categoryEntity = await this.categoryRepository.getById(categoryId);
        if (!categoryEntity) {
          throw new NotFoundException(['Category not found']);
        }

        const productCategoryEntity = new ProductCategoryEntity();
        productCategoryEntity.product = productEntity;
        productCategoryEntity.category = categoryEntity;
        productCategoryEntity.isActive = true;
        return productCategoryEntity;
      }));

      // Save product category entities
      await queryRunner.manager.save(categoryEntities);

      // Commit the transaction
      await queryRunner.commitTransaction();

      this.LOGGER.log(`Product created successfully`);
      return new ResponseDTO(201, 'Product created successfully', null);

    } catch (error) {
      this.LOGGER.error(`Failed to create product: ${error.message}`);
      // Rollback the transaction
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      // Release the queryRunner
      await queryRunner.release();
    }
  }


  async updateProduct(id: number, productDTO: ProductDTO, userName: string): Promise<ResponseDTO> {

  }


}