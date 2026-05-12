import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ContractConfig } from './ContractConfig.entity.js';

@Entity('production_config')
export class ProductionConfig {
  @PrimaryGeneratedColumn('uuid')
  production_config_id: string;

  @OneToMany(() => ContractConfig, (contract) => contract.production)
  contracts: ContractConfig[];
}
