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

  // search category by pagination and status
  async searchUserByPagination(searchTerm: string,
                                   status: 'active' | 'inactive' | 'all',
                                   page: number,
                                   limit: number, ): Promise<[UserEntity[], number]>{
    const query = this.userRepository.createQueryBuilder('user');

    // Search conditions
    query.where(
      '(user.name LIKE :searchTerm ' +
      'OR user.email LIKE :searchTerm ' +
      'OR user.contact LIKE :searchTerm ' +
      'OR user.address LIKE :searchTerm ' +
      'OR user.city LIKE :searchTerm ' +
      'OR user.postal_code LIKE :searchTerm ' +
      'OR user.role LIKE :searchTerm ' +
      'OR user.create_by LIKE :searchTerm ' +
      'OR user.modify_by LIKE :searchTerm ' +
      'OR DATE(user.create_date) LIKE :searchTerm ' +
      'OR DATE(user.modify_date) LIKE :searchTerm)',
      { searchTerm: `%${searchTerm}%` },
    );

    // Apply isActive filter if not all
    if (status !== 'all') {
      const isActive = status === 'active' ? 1 : 0;
      query.andWhere('user.is_active = :isActive', { isActive });
    }

    query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.create_date', 'DESC');

    const [result, total] = await query.getManyAndCount();

    return [result, total];
  }
}