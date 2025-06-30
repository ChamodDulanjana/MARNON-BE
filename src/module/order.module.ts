import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../entity/order.entity';
import { OrderService } from '../service/order.service';
import { OrderRepository } from '../repository/order.repository';
import { OrderController } from '../controller/order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]), // Import OrderEntity
  ],
  providers: [OrderService, OrderRepository], // Import OrderService and OrderRepository
  controllers: [OrderController], // Import OrderController
  exports: [OrderRepository], // Export OrderRepo
})
export class OrderModule {}