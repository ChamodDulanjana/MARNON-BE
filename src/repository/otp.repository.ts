import { OtpEntity } from '../entity/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class OtpRepository{
  constructor(
    @InjectRepository(OtpEntity) // Injecting the OtpEntity repository
    private readonly otpRepository: Repository<OtpEntity>,
  ) {}

  async createOtp(otp: OtpEntity): Promise<OtpEntity> {
    return await this.otpRepository.save(otp);
  }

  async findByEmail(email: string): Promise<OtpEntity | null> {
    return await this.otpRepository.findOne({
      where: {email: email, isActive: true},
      order: { createDate: 'DESC' } // Get the most recent OTP
    });
  }

  // Deactivate OTPs that generated today
  async deactivateOtps(email: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of the day

    await this.otpRepository.update(
      { createDate: MoreThan(today), email: email, isActive: true }, // Find active OTPs created today
      { isActive: false } // Deactivate them
    );
  }
}