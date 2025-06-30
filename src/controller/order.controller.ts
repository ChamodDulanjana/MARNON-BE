import { Controller, Get, Logger, Param, Query, UseGuards } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';
import { ResponseDTO } from '../dto/req&resp/response.dto';

@Controller('order') // Base route for this controller
export class OrderController {
  private readonly LOGGER = new Logger(OrderController.name);

  constructor(
    // Injecting the UserProduct service
    private readonly orderService: OrderService,
  ){}


  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/sales-count/by-month-year')
  async getSalesCountByMonthAndYear(@Query('month') month: number, @Query('year') year: number): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get products by month ${month} and year ${year}`);
      return await this.orderService.getSalesCountByMonthAndYear(month, year);
    } catch (error) {
      this.LOGGER.error(`Failed to get products by month and year: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('sales-count/of/all-months')
  async getSalesCountOfAllMonths(){
    try {
      this.LOGGER.log('Received request to get all sales in months');
      return await this.orderService.getSalesCountOfAllMonths();
    } catch (error) {
      this.LOGGER.error(`Failed to get all sales in months: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('sales-count/of/day-range/:numberOfDays')
  async getSalesCountOfDayRange(@Param('numberOfDays') numberOfDays: number): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get all sales in last ${numberOfDays} days`);
      return await this.orderService.getSalesCountOfDayRange(numberOfDays);
    } catch (error) {
      this.LOGGER.error(`Failed to get all sales in last ${numberOfDays} days: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('sales-count/:date')
  async getSalesCountByDate(@Param('date') date: string): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get all sales count by date ${date}`);
      return await this.orderService.getSalesCountByDate(date);
    } catch (error) {
      this.LOGGER.error(`Failed to get all sales count by date: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('monthly-sales')
  async getMonthlySales(@Query('year') year: number, @Query('month') month: number): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get monthly sales for month ${month} and year ${year}`);
      return await this.orderService.getMonthlySales(year, month);
    } catch (error) {
      this.LOGGER.error(`Failed to get monthly sales: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('monthly-revenue')
  async getMonthlyRevenue(@Query('year') year: number, @Query('month') month: number): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get monthly revenue for month ${month} and year ${year}`);
      return await this.orderService.getMonthlyRevenue(year, month);
    } catch (error) {
      this.LOGGER.error(`Failed to get monthly revenue: ${error.message}`);
      throw error;
    }
  }
}