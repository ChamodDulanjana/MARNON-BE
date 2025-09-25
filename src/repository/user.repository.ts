import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from '../common/enums/role.enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(user: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }

  async findActiveUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email, isActive: true } });
  }

  async findActiveUserById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id, isActive : true },
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getAllActiveUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find({ where: { isActive: true } });
  }

  // Check id user email exists
  async isEmailExist(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  // Check if user contact exists
  async isContactExist(contact: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { contact: contact } });
  }

  async getAllCustomersCount(): Promise<number> {
    return await this.userRepository.count({ where: { role: RoleEnum.USER } });
  }
}