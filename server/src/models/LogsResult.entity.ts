import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SimulationRun } from './SimulationRun.entity.js';
import { ContractConfig } from './ContractConfig.entity.js';

@Entity('logs_result')
export class LogsResult {
  @PrimaryGeneratedColumn('uuid')
  logs_result_id: string;

  @ManyToOne(() => SimulationRun, (run) => run.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'simulation_run_id' })
  simulationRun: SimulationRun;

  @ManyToOne(() => ContractConfig, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: ContractConfig;

  @Column({ type: 'jsonb', nullable: true })
  message_sent: any;

  @Column({ type: 'jsonb', nullable: true })
  message_received: any;
}
