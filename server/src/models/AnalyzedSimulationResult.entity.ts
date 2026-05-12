import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { SimulationRun } from './SimulationRun.entity.js';
import { ContractResult } from './ContractResult.entity.js';

@Entity('analyzed_simulation_result')
export class AnalyzedSimulationResult {
  @PrimaryGeneratedColumn('uuid')
  analyzed_simulation_result_id: string;

  @OneToOne(() => SimulationRun, (run) => run.analysis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'simulation_run_id' })
  simulationRun: SimulationRun;

  @Column({ type: 'double precision', nullable: true })
  calculated_latency: number;

  @Column({ type: 'double precision', nullable: true })
  lost_message_count: number;

  @Column({ type: 'jsonb', nullable: true })
  anomalies: any;

  @Column({ type: 'text', nullable: true })
  s3_link: string;

  @OneToMany(() => ContractResult, (res) => res.analyzedResult)
  contractResults: ContractResult[];
}
