import { Controller, Get, Logger, Param, Query, UseGuards } from '@nestjs/common';
import { UserProductService } from '../service/user_product.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';
import { ResponseDTO } from '../dto/req&resp/response.dto';

@Controller('user-product')
export class UserProductController{
  private readonly LOGGER = new Logger(UserProductController.name);

  constructor(
    // Injecting the UserProduct service
    private readonly userProductService: UserProductService,
  ){}


  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/product/sales/by-month-year')
  async getProductSalesByMonthAndYear(@Query('month') month: number, @Query('year') year: number): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get products by month ${month} and year ${year}`);
      return await this.userProductService.getProductSalesByMonthAndYear(month, year);
    } catch (error) {
      this.LOGGER.error(`Failed to get products by month and year: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/sales/in-months')
  async getAllSalesInMonths(){
    try {
      this.LOGGER.log('Received request to get all sales in months');
      return await this.userProductService.getAllSalesInMonths();
    } catch (error) {
      this.LOGGER.error(`Failed to get all sales in months: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/sales/in-days/:numberOfDays')
  async getAllSalesInDays(@Param('numberOfDays') numberOfDays: number): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get all sales in last ${numberOfDays} days`);
      return await this.userProductService.getAllSalesInDays(numberOfDays);
    } catch (error) {
      this.LOGGER.error(`Failed to get all sales in last ${numberOfDays} days: ${error.message}`);
      throw error;
    }
  }
}