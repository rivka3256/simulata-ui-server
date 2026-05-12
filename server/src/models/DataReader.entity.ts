import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ContractConfig } from './ContractConfig.entity.js';

@Entity('data_reader')
export class DataReader {
  @PrimaryGeneratedColumn('uuid')
  data_reader_id: string;

  @OneToOne(() => ContractConfig, (contract) => contract.dataReader, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: ContractConfig;

  @Column({ type: 'int' })
  message_count: number;

  @Column({ type: 'int' })
  message_frequency_hz: number;
}
