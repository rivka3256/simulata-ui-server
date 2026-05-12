import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ProductionConfig } from './ProductionConfig.entity.js';
import { DataReader } from './DataReader.entity.js';
import { DataWriter } from './DataWriter.entity.js';

@Entity('contract_config')
export class ContractConfig {
  @PrimaryGeneratedColumn('uuid')
  contract_config_id: string;

  @ManyToOne(() => ProductionConfig, (prod) => prod.contracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'production_id' })
  production: ProductionConfig;

  @Column({ type: 'text' })
  version: string;

  @OneToOne(() => DataReader, (reader) => reader.contract)
  dataReader: DataReader;

  @OneToOne(() => DataWriter, (writer) => writer.contract)
  dataWriter: DataWriter;
}
