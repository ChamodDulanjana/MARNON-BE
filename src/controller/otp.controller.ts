import { Controller, Logger, Param, Patch, Post } from '@nestjs/common';
import { OtpService } from '../service/otp.service';

@Controller('otp')
export class OtpController{
  private readonly LOGGER = new Logger(OtpController.name);

  constructor(
    private readonly otpService: OtpService,
  ) {
  }

  @Post(':email')
  async sendOtp(@Param('email') email: string){
    try {
      this.LOGGER.log('Creating OTP email: ' + email);
      return await this.otpService.sendOtpForSignup(email);
    } catch (error) {
      this.LOGGER.error('Error creating OTP email: ' + email, error);
      throw error; // Re-throw the error to be handled by global exception filter
    }
  }

  @Patch('verify/:email/:otpCode')
  async verifyOtp(@Param('email') email: string, @Param('otpCode') otpCode: number){
    try {
      this.LOGGER.log(`Verifying OTP for email: ${email} with code: ${otpCode}`);
      return await this.otpService.verifyOtp(email, Number(otpCode));
    } catch (error) {
      this.LOGGER.error(`Error verifying OTP for email: ${email}`, error);
      throw error; // Re-throw the error to be handled by global exception filter
    }
  }
}