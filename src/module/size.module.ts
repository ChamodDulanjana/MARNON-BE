import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeEntity } from '../entity/size.entity';
import { SizeService } from '../service/size.service';
import { SizeRepository } from '../repository/size.repository';
import { SizeController } from '../controller/size.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SizeEntity]), // Import User Entity
  ],
  providers: [SizeService, SizeRepository], // Import Service and Repository
  controllers: [SizeController], // Import Controller
  exports: [SizeRepository], // Export Repository
})
export class SizeModule {}