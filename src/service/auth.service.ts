import { Injectable, Logger } from '@nestjs/common';
import { RequestDTO } from '../dto/req&resp/request.dto';
import { UserEntity } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../repository/user.repository';
import { UserDTO } from '../dto/user.dto';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { RoleEnum } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  private readonly LOGGER = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  // Login
  async signIn(request: RequestDTO): Promise<ResponseDTO> {
    const user = await this.userRepository.findUserByEmail(request.email);
    if (user && (await bcrypt.compare(request.password, user.password))) {
      const payload = {
        username: user.username,
        userId: user.id,
        role: user.role,
      };

      this.LOGGER.log(`${user.email} logged successfully`);
      return new ResponseDTO(200, `${user.email} logged successfully`, {
        accessToken: this.jwtService.sign(payload),
        userName: user.username,
        userId: user.id,
        role: user.role,
      }); // Return JWT token
    }
    // throw new UnauthorizedException('Invalid credentials');
    return new ResponseDTO(401, 'Invalid credentials');
  }

  // Create user
  async signUp(userDTO: UserDTO): Promise<ResponseDTO> {
    try {
      // Check if user email exists
      if (await this.userRepository.isEmailExist(userDTO.email)) {
        this.LOGGER.warn(`Email already exists: ${userDTO.email}`);
        return new ResponseDTO(409, 'Email already exists');
      }

      // Check if user contact exists
      if (await this.userRepository.isContactExist(userDTO.contact)) {
        this.LOGGER.warn(`Contact already exists: ${userDTO.contact}`);
        return new ResponseDTO(409, 'Contact already exists');
      }

      // Check if user role is valid
      if (userDTO.role !== RoleEnum.USER) {
        this.LOGGER.warn(`Invalid role specified: ${userDTO.role}`);
        return new ResponseDTO(400, 'Invalid role specified');
      }

      const user = new UserEntity();
      user.name = userDTO.name;
      user.email = userDTO.email;
      user.username = userDTO.email;
      user.password = await bcrypt.hash(userDTO.password, 10);
      user.contact = userDTO.contact;
      user.address = userDTO.address;
      user.role = RoleEnum.USER;
      user.createBy = userDTO.email;
      user.isActive = true;

      await this.userRepository.createUser(user);

      this.LOGGER.log(`User created successfully: ${user.email}`);
      return new ResponseDTO(201, 'User created successfully');
    } catch (error) {
      this.LOGGER.error(`Failed to create user: ${error.message}`);
      return new ResponseDTO(500, `Failed to create user: ${error.message}`);
    }
  }
}