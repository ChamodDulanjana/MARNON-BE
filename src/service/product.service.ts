import { Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { ProductDTO } from '../dto/product.dto';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { AlreadyExistException } from '../common/exception/alreadyExist.exception';

@Injectable()
export class ProductService {
  private readonly LOGGER = new Logger(ProductService.name);

  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

/*  async createProduct(productDTO: ProductDTO): Promise<ResponseDTO> {
    // Check if the product name exists
    if (await this.productRepository.checkProductName(productDTO.name)) {
      throw new AlreadyExistException(['Product name already exists']);
    }

    // Check if the product description exists
    if (await this.productRepository.checkProductDescription(productDTO.description)) {
      throw new AlreadyExistException(['Product description already exists']);
    }

    try {


    } catch (error) {
      this.LOGGER.error(`Failed to create product: ${error.message}`);
      throw error;
    }

  }*/
}