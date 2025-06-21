import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as process from 'node:process';

@Injectable()
export class EmailService{
  private readonly LOGGER = new Logger(EmailService.name);

  async sendOtpEmail(email: string, otp: number): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: Number(process.env.MAIL_PORT) === 465, // Secure if port is 465
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      } as SMTPTransport.Options);

      const mailOptions = {
        from: `"MARNON Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code for MARNON Signup',
        html: this.otpEmailTemplate(otp),
      };

      await transporter.sendMail(mailOptions);

      this.LOGGER.log(`OTP email sent to ${email}`);
    } catch (error) {
      this.LOGGER.error(`Failed to send OTP email to ${email}`, error);
      throw new Error('Failed to send OTP email. Please try again later.');
    }
  }

  otpEmailTemplate(otp: number): string {
    const expiresInMs = Number(process.env.OTP_EXPIRES_IN) || 600000; // default to 10min if not set
    const expiresInMinutes = Math.floor(expiresInMs / 60000);

    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">Welcome to <span style="color: #2d3436;">MARNON shopping</span>!</h2>
      <p>Thanks for signing up. Please use the OTP below to verify your email address:</p>
      <div style="font-size: 20px; font-weight: bold; background: #f3f3f3; padding: 10px; border-radius: 5px; display: inline-block;">
        ${otp}
      </div>
      <p>This OTP will expire in ${expiresInMinutes} minute(s). If you didn't request this, please ignore this email.</p>
      <br />
      <p>– The MARNON Team –</p>
    </div>
  `;
  }

}