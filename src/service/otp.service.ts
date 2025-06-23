import { Injectable, Logger } from '@nestjs/common';
import { OtpRepository } from '../repository/otp.repository';
import { UserRepository } from '../repository/user.repository';
import { OtpEntity } from '../entity/otp.entity';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { EmailService } from './email.service';

@Injectable()
export class OtpService {
  private readonly LOGGER = new Logger(OtpService.name);

  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService,
    private readonly userRepository: UserRepository,
  ) {}

  generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  }

  async sendOtpForSignup(email: string): Promise<ResponseDTO> {
    // Check if the user already exists
    const user = await this.userRepository.findUserByEmail(email);
    if (user) {
      this.LOGGER.error(`User already exists with email: ${email}`);
      return new ResponseDTO(400, 'User already exists with this email.');
    }

    try {
      const otp: number = this.generateOtp();

      const otpEntity = new OtpEntity();
      otpEntity.email = email;
      otpEntity.otp = otp;
      otpEntity.isActive = true;

      await this.otpRepository.createOtp(otpEntity);

      // Fire-and-forget email sending
      // Using setTimeout to avoid blocking the main thread - send email asynchronously as a background task
      // setTimeout(..., 0) tells the JavaScript event loop: “Run this function later, after the current task is done".
      setTimeout(() => {
        this.emailService.sendOtpEmail(email, otp).catch(err => {
          this.LOGGER.error(`Failed to send OTP email to ${email}`, err);
        });
      }, 0);

      this.LOGGER.log(`OTP mail send scheduled: ${email}`);
      return new ResponseDTO(200, 'OTP sent successfully');
    } catch (error) {
      this.LOGGER.error(`Error sending OTP email: ${email}`, error);
      throw error;
    }
  }

  async verifyOtp(email: string, otpCode: number): Promise<ResponseDTO> {
    const otpEntity = await this.otpRepository.findByEmail(email);
    if (!otpEntity) {
      this.LOGGER.error(`OTP not found for email: ${email}`);
      return new ResponseDTO(404, 'OTP not found for this email.');
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