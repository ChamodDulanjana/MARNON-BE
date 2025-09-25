import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from '../entity/otp.entity';
import { OtpService } from '../service/otp.service';
import { OtpRepository } from '../repository/otp.repository';
import { OtpController } from '../controller/otp.controller';
import { UserModule } from './user.module';
import { EmailModule } from './email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpEntity]),
    UserModule,
    EmailModule,
  ],
  providers: [OtpService, OtpRepository],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}