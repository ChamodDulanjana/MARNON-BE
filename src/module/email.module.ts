import { Module } from '@nestjs/common';
import { EmailService } from '../service/email.service';

@Module({
  imports: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}