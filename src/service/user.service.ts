import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { NotFoundException } from '../common/exception/notFound.exception';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { UserDTO } from '../dto/user.dto';
import { ValidationException } from '../common/exception/validation.exception';
import { RoleEnum } from '../common/enums/role.enum';
import { UserEntity } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserUpdateDTO } from '../dto/user-update.dto';
import { PaginationDTO } from '../dto/pagination.dto';

type UserGet = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  contact: string;
  address: string;
  city: string;
  postalCode: string;
  isActive: boolean;
  createDate: Date;
  createBy: string;
  modifyDate: Date;
  modifyBy: string;
}

@Injectable()
export class UserService{
  private readonly LOGGER = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
  ) {
  }

  async getUserById(id: number) {
    const userEntity = await this.userRepository.findActiveUserById(id);
    if (!userEntity) {
      throw new NotFoundException(['User not found']);
    }

    try {
      const userDTO: UserGet = {
        id: userEntity.id,
        name: userEntity.name,
        username: userEntity.username,
        email: userEntity.email,
        role: userEntity.role,
        contact: userEntity.contact,
        address: userEntity.address,
        city: userEntity.city,
        postalCode: userEntity.postalCode,
        isActive: userEntity.isActive,
        createDate: userEntity.createDate,
        createBy: userEntity.createBy,
        modifyDate: userEntity.modifyDate,
        modifyBy: userEntity.modifyBy,
      }

      this.LOGGER.log(`User with id ${id} found successfully`);
      return new ResponseDTO(200, `User with id ${id} found successfully`, userDTO);
    } catch (error) {
      this.LOGGER.error(`Failed to find user: ${error.message}`);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<ResponseDTO> {
    const userEntity = await this.userRepository.findActiveUserByEmail(email);
    if (!userEntity) {
      throw new NotFoundException(['User not found']);
    }

    try {
      const userDTO: UserGet = {
        id: userEntity.id,
        name: userEntity.name,
        username: userEntity.username,
        email: userEntity.email,
        role: userEntity.role,
        contact: userEntity.contact,
        address: userEntity.address,
        city: userEntity.city,
        postalCode: userEntity.postalCode,
        isActive: userEntity.isActive,
        createDate: userEntity.createDate,
        createBy: userEntity.createBy,
        modifyDate: userEntity.modifyDate,
        modifyBy: userEntity.modifyBy,
      }

      this.LOGGER.log(`User with email ${email} found successfully`);
      return new ResponseDTO(200, `User with email ${email} found successfully`, userDTO);
    } catch (error) {
      this.LOGGER.error(`Failed to find user by email: ${error.message}`);
      throw error;
    }
  }

  async getAllUsers(): Promise<ResponseDTO> {
    try {
      const userEntities = await this.userRepository.getAllUsers();
      const userDTOs: UserGet[] = userEntities.map((userEntity) => {
        return {
          id: userEntity.id,
          name: userEntity.name,
          username: userEntity.username,
          email: userEntity.email,
          role: userEntity.role,
          contact: userEntity.contact,
          address: userEntity.address,
          city: userEntity.city,
          postalCode: userEntity.postalCode,
          isActive: userEntity.isActive,
          createDate: userEntity.createDate,
          createBy: userEntity.createBy,
          modifyDate: userEntity.modifyDate,
          modifyBy: userEntity.modifyBy,
        }
      });

      this.LOGGER.log(`All users found successfully`);
      return new ResponseDTO(200, `All users found successfully`, userDTOs);
    } catch (error) {
      this.LOGGER.error(`Failed to get all users: ${error.message}`);
      throw error;
    }
  }

  async getAllActiveUsers(): Promise<ResponseDTO> {
    try {
      const userEntities = await this.userRepository.getAllActiveUsers();
      const userDTOs: UserGet[] = userEntities.map((userEntity) => {
        return {
          id: userEntity.id,
          name: userEntity.name,
          username: userEntity.username,
          email: userEntity.email,
          role: userEntity.role,
          contact: userEntity.contact,
          address: userEntity.address,
          city: userEntity.city,
          postalCode: userEntity.postalCode,
          isActive: userEntity.isActive,
          createDate: userEntity.createDate,
          createBy: userEntity.createBy,
          modifyDate: userEntity.modifyDate,
          modifyBy: userEntity.modifyBy,
        }
      });

      this.LOGGER.log(`All active users found successfully`);
      return new ResponseDTO(200, `All active users found successfully`, userDTOs);
    } catch (error) {
      this.LOGGER.error(`Failed to get all active users: ${error.message}`);
      throw error;
    }
  }

  async updateByRegularUser(id: number, userDTO: UserUpdateDTO, userName: string): Promise<ResponseDTO> {
    const userEntity = await this.userRepository.findActiveUserById(id);
    if (!userEntity) {
      throw new NotFoundException(['User not found']);
    }

    // Check if user contact exists
    const userByContact = await this.userRepository.isContactExist(userDTO.contact);
    if (userByContact && userByContact.id !== id) {
      throw new ValidationException(['Contact already exists']);
    }

    try {
      userEntity.name = userDTO.name;
      userEntity.contact = userDTO.contact;
      userEntity.address = userDTO.address;
      userDTO.city && (userEntity.city = userDTO.city);
      userDTO.postalCode && (userEntity.postalCode = userDTO.postalCode);
      userEntity.modifyBy = userName;

      await this.userRepository.createUser(userEntity);

      this.LOGGER.log(`User with id ${id} updated successfully`);
      return new ResponseDTO(200, `User with id ${id} updated successfully`);
    } catch (error) {
      this.LOGGER.error(`Failed to update user: ${error.message}`);
      throw error;
    }
  }

  async updateByAdminUser(id: number, userDTO: UserUpdateDTO, userName: string): Promise<ResponseDTO> {
    const userEntity = await this.userRepository.findActiveUserById(id);
    if (!userEntity) {
      throw new NotFoundException(['User not found']);
    }

    // Check if user contact exists
    const userByContact = await this.userRepository.isContactExist(userDTO.contact);
    if (userByContact && userByContact.id !== id) {
      throw new ValidationException(['Contact already exists']);
    }

    // Check if user role is valid
    if (userDTO.role !== RoleEnum.USER && userDTO.role !== RoleEnum.ADMIN) {
      throw new ValidationException([`Invalid Role`]);
    }

    try {
      userEntity.name = userDTO.name;
      userEntity.contact = userDTO.contact;
      userEntity.address = userDTO.address;
      userDTO.city && (userEntity.city = userDTO.city);
      userDTO.postalCode && (userEntity.postalCode = userDTO.postalCode);
      userEntity.role = userDTO.role;
      userEntity.modifyBy = userName;

      await this.userRepository.createUser(userEntity);

      this.LOGGER.log(`User with id ${id} updated successfully`);
      return new ResponseDTO(200, `User with id ${id} updated successfully`);
    } catch (error) {
      this.LOGGER.error(`Failed to update user: ${error.message}`);
      throw error;
    }
  }

  async createByAdminUser(userDTO: UserDTO, userName: string): Promise<ResponseDTO> {
    // Check if user email exists
    if (await this.userRepository.isEmailExist(userDTO.email)) {
      throw new ValidationException(['Email already exists']);
    }

    // Check if user contact exists
    if (await this.userRepository.isContactExist(userDTO.contact)) {
      throw new ValidationException(['Contact already exists']);
    }

    // Check if user role is valid
    if (userDTO.role !== RoleEnum.USER && userDTO.role !== RoleEnum.ADMIN) {
      throw new ValidationException([`Invalid Role`]);
    }

    try {
      const userEntity = new UserEntity();
      userEntity.name = userDTO.name;
      userEntity.email = userDTO.email;
      userEntity.username = userDTO.email;
      userEntity.password = await bcrypt.hash(userDTO.password, 10);
      userEntity.contact = userDTO.contact;
      userEntity.address = userDTO.address;
      userDTO.city && (userEntity.city = userDTO.city);
      userDTO.postalCode && (userEntity.postalCode = userDTO.postalCode);
      userEntity.role = userDTO.role;
      userEntity.createBy = userName;
      userEntity.isActive = true;

      await this.userRepository.createUser(userEntity);

      this.LOGGER.log(`User created successfully: ${userEntity.email}`);
      return new ResponseDTO(201, 'User created successfully');
    } catch (error) {
      this.LOGGER.error(`Failed to create user: ${error.message}`);
      throw error;
    }
  }

  async getAllCustomersCount(): Promise<ResponseDTO> {
    try {
      const count = await this.userRepository.getAllCustomersCount();

      this.LOGGER.log(`Total customers count: ${count}`);
      return new ResponseDTO(200, `Total customers count: ${count}`, count);
    } catch (error) {
      this.LOGGER.error(`Failed to get all customers count: ${error.message}`);
      throw error;
    }
  }

  async fillCheckoutUserDetails(userDTO: UserUpdateDTO, id: number, userName: string): Promise<ResponseDTO> {
    const userEntity = await this.userRepository.findActiveUserById(id);
    if (!userEntity) {
      throw new NotFoundException(['User not found']);
    }

    // Check if town or city is provided
    if (!userDTO.city || userDTO.city.trim() === '') {
      throw new BadRequestException('City is required');
    }

    // Check if postal code is provided
    if (!userDTO.postalCode || userDTO.postalCode.trim() === '') {
      throw new BadRequestException('Postal Code is required');
    }

    try {
      userEntity.name = userDTO.name;
      userEntity.contact = userDTO.contact;
      userEntity.address = userDTO.address;
      userEntity.city = userDTO.city;
      userEntity.postalCode = userDTO.postalCode;
      userEntity.modifyBy = userName;

      await this.userRepository.createUser(userEntity);

      this.LOGGER.log(`User with id ${id} updated successfully`);
      return new ResponseDTO(200, `User with id ${id} updated successfully`);
    } catch (error) {
      this.LOGGER.error(`Failed to update user: ${error.message}`);
      throw error;
    }
  }

  async searchUserByPagination(searchTerm: string,
                                   status: 'active' | 'inactive' | 'all',
                                   pagination: PaginationDTO, ): Promise<ResponseDTO>{

    try {
      const { page, limit } = pagination;

      const [userEntities, total] = await this.userRepository.searchUserByPagination(searchTerm, status, page, limit);

      const userList: UserGet[] = userEntities.map((userEntity) => {
        return {
          id: userEntity.id,
          name: userEntity.name,
          username: userEntity.username,
          email: userEntity.email,
          role: userEntity.role,
          contact: userEntity.contact,
          address: userEntity.address,
          city: userEntity.city,
          postalCode: userEntity.postalCode,
          isActive: userEntity.isActive,
          createDate: userEntity.createDate,
          createBy: userEntity.createBy,
          modifyDate: userEntity.modifyDate,
          modifyBy: userEntity.modifyBy,
        }
      });

      const meta = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

      this.LOGGER.log(`User Search results for "${searchTerm}" found successfully`);
      return new ResponseDTO(200, `User search results fetched successfully`, { userList, meta });
    } catch (error) {
      this.LOGGER.error(`Failed to search user: ${error.message}`);
      throw error;
    }
  }
}