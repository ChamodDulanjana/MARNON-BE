import { CreateDateColumn, UpdateDateColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn({ name: 'create_date', type: 'timestamp', nullable: false })
  createDate: Date;

  @Column({ name: 'create_by', nullable: true })
  createBy: string;

  @UpdateDateColumn({ name: 'modify_date', type: 'timestamp' })
  modifyDate: Date;

  @Column({ name: 'modify_by', nullable: true })
  modifyBy: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
