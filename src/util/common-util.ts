import { JwtService } from '@nestjs/jwt';

export class CommonUtil{
  public static extractTokenFromRequest(req: Request): string {
    const token = req.headers['authorization']?.split(' ')[1];
    return token;
  }

  public static extractUsernameFromToken(req: Request, jwtService: JwtService): string {
    const token = req.headers['authorization']?.split(' ')[1];
    const payload = jwtService.decode(token);
    return payload['username'];
  }
}