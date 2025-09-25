import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestDTO } from '../dto/req&resp/request.dto';
import { UserEntity } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../repository/user.repository';
import { UserDTO } from '../dto/user.dto';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { RoleEnum } from '../common/enums/role.enum';
import { AlreadyExistException } from '../common/exception/alreadyExist.exception';
import { Response } from 'express';
import * as process from 'node:process';

@Injectable()
export class AuthService {
  private readonly LOGGER = new Logger(AuthService.name);
  private readonly cookieMaxAge = Number(process.env.COOKIE_MAX_AGE);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  // Login
  async signIn(request: RequestDTO, res: Response): Promise<ResponseDTO> {
    const user = await this.userRepository.findActiveUserByEmail(request.email);
    if (user && (await bcrypt.compare(request.password, user.password))) {
      const payload = {
        username: user.username,
        userId: user.id,
        role: user.role,
      };

      // Generate JWT token
      const token = this.jwtService.sign(payload);

      // 👉 Set JWT in cookie
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: true, // Set to true in production (HTTPS)
        sameSite: 'lax',
        maxAge: this.cookieMaxAge,
        //domain: process.env.DOMAIN, // Optional: allows sharing across subdomains
      });

      // 👉 Set username in cookie
      res.cookie('username', payload.username, {
        secure: true, // Set to true in production (HTTPS)
        sameSite: 'lax',
        maxAge: this.cookieMaxAge,
      });

      // 👉 Set role in cookie
      res.cookie('role', payload.role, {
        secure: true, // Set to true in production (HTTPS)
        sameSite: 'lax',
        maxAge: this.cookieMaxAge,
      });

      this.LOGGER.log(`${user.email} logged successfully`);
      return new ResponseDTO(200, `${user.email} logged successfully`, {
        userName: user.username,
        userId: user.id,
        role: user.role,
      }); // Return user data along with status code
    }
    throw new BadRequestException('Please check your email and password.');
  }

  // Create user
  async signUp(userDTO: UserDTO): Promise<ResponseDTO> {
    // Check if user email exists
    if (await this.userRepository.isEmailExist(userDTO.email)) {
      throw new AlreadyExistException(['Email already exists']);
    }

    // Check if user contact exists
    if (await this.userRepository.isContactExist(userDTO.contact)) {
      this.LOGGER.warn(`Contact already exists: ${userDTO.contact}`);
      throw new AlreadyExistException(['Contact already exists']);
    }

    // Check if user role is valid
    if (userDTO.role !== RoleEnum.USER) {
      this.LOGGER.warn(`Invalid role specified: ${userDTO.role}`);
      throw new BadRequestException('Invalid role specified');
    }

    try {
      const user = new UserEntity();
      user.name = userDTO.name;
      user.email = userDTO.email;
      user.username = userDTO.email;
      user.password = await bcrypt.hash(userDTO.password, 10);
      user.contact = userDTO.contact;
      user.streetAddress = userDTO.streetAddress;
      user.role = RoleEnum.USER;
      user.createBy = userDTO.email;
      user.isActive = true;

      await this.userRepository.createUser(user);

      this.LOGGER.log(`User created successfully: ${user.email}`);
      return new ResponseDTO(201, 'User created successfully');
    } catch (error) {
      this.LOGGER.error(`Failed to create user: ${error.message}`);
      throw error; // Propagate the error for further handling
    }
  }

  // Logout
  async logout(res: Response): Promise<ResponseDTO> {
    // Clear the cookie by setting its maxAge to 0
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true, // Set to true in production (HTTPS)
      sameSite: 'lax',
    });

    res.clearCookie('username', {
      secure: true, // Set to true in production (HTTPS)
      sameSite: 'lax',
    });

    res.clearCookie('role', {
      secure: true, // Set to true in production (HTTPS)
      sameSite: 'lax',
    });

    this.LOGGER.log('User logged out successfully');
    return new ResponseDTO(200, 'User logged out successfully');
  }
}