import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from '../entity/otp.entity';
import { OtpService } from '../service/otp.service';
import { OtpRepository } from '../repository/otp.repository';
import { OtpController } from '../controller/otp.controller';
import { UserRepository } from '../repository/user.repository';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpEntity]),
    UserModule,
  ],
  providers: [OtpService, OtpRepository],
  controllers: [OtpController],
  //exports: [],
})
export class OtpModule {}