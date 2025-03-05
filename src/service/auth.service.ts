import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RequestDTO } from '../dto/req&resp/request.dto';
import { UserEntity } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../repository/user.repository';
import { UserDTO } from '../dto/user.dto';
import { ResponseDTO } from '../dto/req&resp/response.dto';

@Injectable()
export class AuthService {
  private readonly LOGGER = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
  }

  // Login
  async signIn(request: RequestDTO): Promise<{ access_token: string }> {
    const user = await this.userRepository.findUserByEmail(request.email);
    if (user && (await bcrypt.compare(request.password, user.password))) {
      const payload = { username: user.username, sub: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // Create user
  async signUp(userDTO: UserDTO): Promise<ResponseDTO> {
    try {
      const user = new UserEntity();
      user.name = userDTO.name;
      user.email = userDTO.email;
      user.username = userDTO.email;
      user.password = await bcrypt.hash(userDTO.password, 10);
      user.contact = userDTO.contact;
      user.address = userDTO.address;
      user.role = userDTO.role;

      await this.userRepository.createUser(user);

      this.LOGGER.log('User created successfully: {}', user.name);
      return new ResponseDTO(201, 'User created successfully');
    } catch (error) {
      this.LOGGER.error('Failed to create user: {}', error.message);
      return new ResponseDTO(500, error.message);
    }

  }
}