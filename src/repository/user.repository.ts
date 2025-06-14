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
    return this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getAllActiveUsers(): Promise<UserEntity[]> {
    return this.userRepository.find({ where: { isActive: true } });
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
    return this.userRepository.count({ where: { role: RoleEnum.USER } });
  }
}