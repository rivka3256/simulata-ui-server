import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ContractConfig } from './ContractConfig.entity.js';

@Entity('data_writer')
export class DataWriter {
  @PrimaryGeneratedColumn('uuid')
  data_writer_id: string;

  @OneToOne(() => ContractConfig, (contract) => contract.dataWriter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: ContractConfig;

  @Column({ type: 'int' })
  message_count: number;

  @Column({ type: 'int' })
  message_frequency_hz: number;
}
