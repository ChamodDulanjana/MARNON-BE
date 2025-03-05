import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../service/auth.service';
import { AuthController } from '../controller/auth.controller';
import { UserModule } from './user.module';

@Module({
  imports: [
    UserModule, // Import Users Module
    PassportModule,
    JwtModule.register({
      global: true,
      secret: String(process.env.JWT_SECRET),
      signOptions: { expiresIn: String(process.env.JWT_EXPIRES_IN) },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
