import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entity/order.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(OrderEntity) // Injecting the order repository
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly dataSource: DataSource, // Injecting the data source
  ) {
  }

  async getSalesCountByMonthAndYear(month: number, year: number): Promise<any[]> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.product', 'product')
      .innerJoin('product.productCategory', 'productCategory')
      .innerJoin('productCategory.category', 'category')
      .select('category.name', 'category')
      .addSelect('COUNT(order.id)', 'sales')
      .where('MONTH(order.createDate) = :month', { month })
      .andWhere('YEAR(order.createDate) = :year', { year })
      .andWhere('order.isActive = true')
      .andWhere('product.isActive = true')
      .andWhere('productCategory.isActive = true')
      .groupBy('category.name')
      .getRawMany();

    return result;
  }

  async getSalesCountOfAllMonths(): Promise<any[]> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.product', 'product')
      .innerJoin('product.productCategory', 'productCategory')
      .innerJoin('productCategory.category', 'category')
      .select("MONTH(order.createDate)", "monthNumber")
      .addSelect("MONTHNAME(order.createDate)", "month")
      .addSelect("category.name", "category")
      .addSelect("COUNT(order.id)", "sales")
      .where("order.isActive = true")
      .andWhere("product.isActive = true")
      .andWhere("productCategory.isActive = true")
      .groupBy("monthNumber, month, category.name")
      .orderBy("monthNumber", "ASC")
      .getRawMany();

    return result;
  }

  async getSalesCountOfDayRange(numberOfDays: number): Promise<any[]> {
    const categories = ['Men', 'Women', 'Kid'];

    const result = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.product', 'product')
      .innerJoin('product.productCategory', 'productCategory')
      .innerJoin('productCategory.category', 'category')
      .select("DATE_FORMAT(order.createDate, '%Y-%m-%d')", "date")
      .addSelect("category.name", "category")
      .addSelect("COUNT(order.id)", "sales")
      .where("order.isActive = true")
      .andWhere("product.isActive = true")
      .andWhere("productCategory.isActive = true")
      .andWhere("category.isActive = true")
      .andWhere("category.name IN (:...categories)", {categories})
      .andWhere("order.createDate >= CURDATE() - INTERVAL :days DAY", { days: numberOfDays - 1 })
      .groupBy("DATE_FORMAT(order.createDate, '%Y-%m-%d'), category.name")
      .orderBy("date", "ASC")
      .getRawMany();

    return result;
  }

  async getSalesCountByDate(date: string){
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'salesCount')
      .where('DATE(order.createDate) = :date', { date })
      .andWhere('order.isActive = true')
      .getRawOne();

    return !result ? 0 : parseInt(result.salesCount, 10);
  }

  async getMonthlySales(year: number, month: number){
    // fetch total monthly sales by total selling of all products sold in that month
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.product', 'product')
      .select('SUM(product.sellingPrice)', 'totalSales')
      .where('YEAR(order.createDate) = :year', { year })
      .andWhere('MONTH(order.createDate) = :month', { month })
      .andWhere('order.isActive = true')
      .andWhere('product.isActive = true')
      .getRawOne();

    return !result ? 0 : parseFloat(result.totalSales);
  }

  async getMonthlyRevenue(year: number, month: number): Promise<number> {
    // fetch total monthly revenue by total sellingPrice substract totalBuyingPrice of all products sold in that month
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.product', 'product')
      .select('SUM(product.sellingPrice - product.buyingPrice)', 'totalRevenue')
      .where('YEAR(order.createDate) = :year', { year })
      .andWhere('MONTH(order.createDate) = :month', { month })
      .andWhere('order.isActive = true')
      .andWhere('product.isActive = true')
      .getRawOne();

    return !result ? 0 : parseFloat(result.totalRevenue);
  }

  async getSalesCountByProductId(productId: number): Promise<number> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'salesCount')
      .where('order.product_Id = :productId', { productId })
      .andWhere('order.isActive = true')
      .getRawOne();

    return !result ? 0 : parseInt(result.salesCount, 10);
  }
}