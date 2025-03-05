import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { NotFoundException } from '../common/exception/notFound.exception';
import { ResponseDTO } from '../dto/req&resp/response.dto';

type UserGet = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  contact: string;
  address: string;
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
    const userEntity = await this.userRepository.findById(id);
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
}