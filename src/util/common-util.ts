import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export class CommonUtil{
  private static jwtService = new JwtService();

  public static extractPayloadFromToken(req: Request) {
    const token = req.cookies['access_token'];
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    return {
      userId: payload['userId'],
      userName: payload['username'],
      role: payload['role'],
    }
  }
}