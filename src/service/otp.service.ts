import { Injectable, Logger } from '@nestjs/common';
import { OtpRepository } from '../repository/otp.repository';
import { UserRepository } from '../repository/user.repository';
import { NotFoundException } from '../common/exception/notFound.exception';
import { OtpEntity } from '../entity/otp.entity';
import { ResponseDTO } from '../dto/req&resp/response.dto';

@Injectable()
export class OtpService{
  private readonly LOGGER = new Logger(OtpService.name);

  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly userRepository: UserRepository,
  ) {
  }

  async createOtpForSignup(email: string): Promise<ResponseDTO>{
    // Generate OTP logic here
    try {
      const otp: number = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

      const otpEntity = new OtpEntity();
      otpEntity.email = email;
      otpEntity.otp = otp;
      otpEntity.isActive = true; // Set OTP as active

      await this.otpRepository.createOtp(otpEntity);

      this.LOGGER.log(`OTP created for email: ${email}`);
      return new ResponseDTO(201, 'OTP created successfully', {otp});
    } catch (error) {
      this.LOGGER.error(`Error creating OTP for email: ${email}`, error);
      throw new Error('Failed to create OTP');
    }
  }

  async verifyOtp(email: string, otpCode: number): Promise<ResponseDTO> {
    const otpEntity = await this.otpRepository.findByEmail(email);

    if (!otpEntity) {
      throw new NotFoundException([`OTP for email ${email} not found.`]);
    }

    try {
      // Check if the OTP is active and matches the provided code
      if (otpEntity.otp !== otpCode) {
        return new ResponseDTO(400, 'Invalid OTP.');
      }

      // Check if the OTP is expired
      const currentTime = new Date();
      const otpCreationTime = new Date(otpEntity.createDate);
      const otpExpiryTime = new Date(otpCreationTime.getTime() + Number(process.env.OTP_EXPIRES_IN)); // OTP valid for 5 minutes
      if (currentTime > otpExpiryTime) {
        return new ResponseDTO(400, 'OTP has expired. Please request a new OTP.');
      }

      // Deactivate the OTP after successful verification
      await this.otpRepository.deactivateOtps(email);

      this.LOGGER.log(`OTP verified successfully for email: ${email}`);
      return new ResponseDTO(200, 'OTP verified successfully');
    } catch (error) {
      this.LOGGER.error(`Error verifying OTP for email: ${email}`, error);
      throw error;
    }
  }
}