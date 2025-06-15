import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProductEntity } from '../entity/user_product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserProductRepository{
  constructor(
    @InjectRepository(UserProductEntity) // Injecting the UserProduct repository
    private readonly userProductRepository: Repository<UserProductEntity>,
  ) {
  }

  async getProductSalesByMonthAndYear(month: number, year: number): Promise<any[]> {
    const result = await this.userProductRepository
      .createQueryBuilder('userProduct')
      .innerJoin('userProduct.product', 'product')
      .innerJoin('product.productCategory', 'productCategory')
      .innerJoin('productCategory.category', 'category')
      .select('category.name', 'category')
      .addSelect('COUNT(userProduct.id)', 'sales')
      .where('MONTH(userProduct.createDate) = :month', { month })
      .andWhere('YEAR(userProduct.createDate) = :year', { year })
      .andWhere('userProduct.isActive = true')
      .andWhere('product.isActive = true')
      .andWhere('productCategory.isActive = true')
      .groupBy('category.name')
      .getRawMany();

    return result;
  }

  async getAllSalesInMonths(): Promise<any[]> {
    const result = await this.userProductRepository
      .createQueryBuilder('userProduct')
      .innerJoin('userProduct.product', 'product')
      .innerJoin('product.productCategory', 'productCategory')
      .innerJoin('productCategory.category', 'category')
      .select("MONTH(userProduct.createDate)", "monthNumber")
      .addSelect("MONTHNAME(userProduct.createDate)", "month")
      .addSelect("category.name", "category")
      .addSelect("COUNT(userProduct.id)", "sales")
      .where("userProduct.isActive = true")
      .andWhere("product.isActive = true")
      .andWhere("productCategory.isActive = true")
      .groupBy("monthNumber, month, category.name")
      .orderBy("monthNumber", "ASC")
      .getRawMany();

    return result;
  }

  async getAllSalesInDays(numberOfDays: number): Promise<any[]> {
    const categories = ['Men', 'Women', 'Kid'];

    const result = await this.userProductRepository
      .createQueryBuilder('userProduct')
      .innerJoin('userProduct.product', 'product')
      .innerJoin('product.productCategory', 'productCategory')
      .innerJoin('productCategory.category', 'category')
      .select("DATE_FORMAT(userProduct.createDate, '%Y-%m-%d')", "date")
      .addSelect("category.name", "category")
      .addSelect("COUNT(userProduct.id)", "sales")
      .where("userProduct.isActive = true")
      .andWhere("product.isActive = true")
      .andWhere("productCategory.isActive = true")
      .andWhere("category.isActive = true")
      .andWhere("category.name IN (:...categories)", {categories})
      .andWhere("userProduct.createDate >= CURDATE() - INTERVAL :days DAY", { days: numberOfDays - 1 })
      .groupBy("DATE_FORMAT(userProduct.createDate, '%Y-%m-%d'), category.name")
      .orderBy("date", "ASC")
      .getRawMany();

    return result;
  }
}