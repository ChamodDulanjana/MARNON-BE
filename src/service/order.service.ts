import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { ResponseDTO } from '../dto/req&resp/response.dto';

@Injectable()
export class OrderService {
  private readonly LOGGER = new Logger(OrderService.name);

  constructor(
    // Injecting the Order repository
    private readonly orderRepository: OrderRepository,
  ) {
  }

  async getSalesCountByMonthAndYear(month: number, year: number): Promise<ResponseDTO> {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Invalid month');
    }
    if (year < 2000 || year > new Date().getFullYear()) {
      throw new BadRequestException('Invalid year');
    }

    try {
      // Fetch products by month and year
      const result = await this.orderRepository.getSalesCountByMonthAndYear(month, year);

      let output: { category: string; sales: number }[] = [];

      const expectedCategories = ['Men', 'Women', 'Kid'];

      // Ensure all expected categories are present in the result
      output =  result
        .filter(row => row.category === 'Men' || row.category === 'Women' || row.category === 'Kid')
        .map(row => ({
          category: row.category,
          sales: row.sales ? parseInt(row.sales, 10) : 0,
        }));

      // Add missing categories with 0 sales
      expectedCategories.forEach(category => {
        if (!output.find(row => row.category === category)) {
          output.push({ category, sales: 0 });
        }
      });

      this.LOGGER.log(`Product sales data found successfully for ${month}/${year}`);
      return new ResponseDTO(200, `Product sales data found successfully for ${month}/${year}`, output);
    } catch (error) {
      this.LOGGER.error(`Failed to get product sales data: ${error.message}`);
      throw error;
    }
  }

  async getSalesCountOfAllMonths(){
    try {
      // Fetch all sales data in months
      const result = await this.orderRepository.getSalesCountOfAllMonths();

      const monthMap: Record<string, any> = {};

      result.forEach(row => {
        const month = row.month;
        const category = row.category;
        const sales = parseInt(row.sales, 10);

        if (!monthMap[month]) {
          // Initialize month entry with 0s
          monthMap[month] = {
            month,
            men: 0,
            women: 0,
            kid: 0,
          };
        }

        const key = category.toLowerCase();
        if (['men', 'women', 'kid'].includes(key)) {
          monthMap[month][key] = sales;
        }
      });

      // Ensure all 12 months are included even if empty
      const monthsInYear = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ];

      const finalResult = monthsInYear.map(month => {
        return (
          monthMap[month] || {
            month,
            men: 0,
            women: 0,
            kid: 0,
          }
        );
      });

      this.LOGGER.log(`All sales data found successfully`);
      return new ResponseDTO(200, 'All sales data found successfully', finalResult);
    } catch (error) {
      this.LOGGER.error(`Failed to get all sales data: ${error.message}`);
      throw error;
    }
  }

  async getSalesCountOfDayRange(numberOfDays: number){
    if (numberOfDays < 7 || numberOfDays > 90) {
      throw new BadRequestException('Number of days must be between 7 and 90');
    }

    try {
      // Fetch all sales data in days
      const result: {category: string, date: string, sales: string}[]
        = await this.orderRepository.getSalesCountOfDayRange(numberOfDays);

      // Build map of date to sales by category
      const dateMap: Record<string, any> = {};

      result.forEach(row => {
        const date = row.date;
        const category = row.category.toLowerCase();
        const sales = parseInt(row.sales, 10);

        if (!dateMap[date]) {
          dateMap[date] = {
            date,
            men: 0,
            women: 0,
            kid: 0,
          };
        }

        if (['men', 'women', 'kid'].includes(category)) {
          dateMap[date][category] = sales;
        }
      });

      // Generate the past N dates even if there is no data for some
      const finalResult: any[] = [];
      for (let i = numberOfDays - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0]; // yyyy-mm-dd

        finalResult.push(
          dateMap[formattedDate] || {
            date: formattedDate,
            men: 0,
            women: 0,
            kid: 0,
          }
        );
      }

      this.LOGGER.log(`All sales data found successfully for the last ${numberOfDays} days`);
      return new ResponseDTO(200, `All sales data found successfully for the last ${numberOfDays} days`, finalResult);
    } catch (error) {
      this.LOGGER.error(`Failed to get all sales data: ${error.message}`);
      throw error;
    }
  }

  async getSalesCountByDate(date: string): Promise<ResponseDTO> {
    if (!date || isNaN(Date.parse(date))) {
      throw new BadRequestException('Invalid date format');
    }

    try {
      // Fetch sales count by date
      const salesCount = await this.orderRepository.getSalesCountByDate(date);

      this.LOGGER.log(`Sales count found successfully for date ${date}`);
      return new ResponseDTO(200, `Sales count found successfully for date ${date}`,  salesCount );
    } catch (error) {
      this.LOGGER.error(`Failed to get sales count by date: ${error.message}`);
      throw error;
    }
  }

  async getMonthlySales(year: number, month: number): Promise<ResponseDTO> {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Invalid month');
    }
    if (year < 2000 || year > new Date().getFullYear()) {
      throw new BadRequestException('Invalid year');
    }

    try {
      // Fetch monthly sales
      const result = await this.orderRepository.getMonthlySales(year, month);

      this.LOGGER.log(`Monthly sales data found successfully for ${month}/${year}`);
      return new ResponseDTO(200, `Monthly sales data found successfully for ${month}/${year}`, result);
    } catch (error) {
      this.LOGGER.error(`Failed to get monthly sales data: ${error.message}`);
      throw error;
    }
  }

  async getMonthlyRevenue(year: number, month: number): Promise<ResponseDTO> {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Invalid month');
    }
    if (year < 2000 || year > new Date().getFullYear()) {
      throw new BadRequestException('Invalid year');
    }

    try {
      // Fetch monthly revenue
      const result = await this.orderRepository.getMonthlyRevenue(year, month);

      this.LOGGER.log(`Monthly revenue data found successfully for ${month}/${year}`);
      return new ResponseDTO(200, `Monthly revenue data found successfully for ${month}/${year}`, result);
    } catch (error) {
      this.LOGGER.error(`Failed to get monthly revenue data: ${error.message}`);
      throw error;
    }
  }
}