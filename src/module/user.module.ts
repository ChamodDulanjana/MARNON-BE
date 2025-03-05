import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { UserRepository } from '../repository/user.repository';
import { UserController } from '../controller/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]), // Import User Entity
  ],
  providers: [UserService, UserRepository], // Import UserService and UserRepository
  controllers: [UserController], // Import UserController
  exports: [UserService, UserRepository], // Export UserService and UserRepository
})
export class UserModule {}