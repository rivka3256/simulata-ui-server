import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AnalyzedSimulationResult } from './AnalyzedSimulationResult.entity.js';
import { ContractConfig } from './ContractConfig.entity.js';

@Entity('contract_result')
export class ContractResult {
  @PrimaryGeneratedColumn('uuid')
  contract_result_id: string;

  @ManyToOne(() => AnalyzedSimulationResult, (res) => res.contractResults, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'analyzed_simulation_result_id' })
  analyzedResult: AnalyzedSimulationResult;

  @ManyToOne(() => ContractConfig, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: ContractConfig;

  @Column({ type: 'double precision', nullable: true })
  latency_avg_ms: number;

  @Column({ type: 'double precision', nullable: true })
  throughput: number;

  @Column({ type: 'text', nullable: true })
  error_details: string;

  @Column({ type: 'int', nullable: true })
  error_count: number;
}
