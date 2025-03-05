import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('user')
export class UserController {
  private readonly LOGGER = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    try {
      this.LOGGER.log(`Received request to get user with id ${id}`);
      return await this.userService.getUserById(id);
    } catch (error) {
      this.LOGGER.error(`Failed to get user: ${error.message}`);
      throw error;
    }
  }
}