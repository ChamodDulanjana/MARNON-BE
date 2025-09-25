import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('otp')
export class OtpEntity{
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({name: 'email'})
  email: string;

  @Column({name: 'otp_code'})
  otp: number;

  @CreateDateColumn({ name: 'create_date', type: 'timestamp', nullable: false })
  createDate: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}