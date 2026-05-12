import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { SimulationConfig } from './SimulationConfig.entity.js';
import { LogsResult } from './LogsResult.entity.js';
import { AnalyzedSimulationResult } from './AnalyzedSimulationResult.entity.js';

@Entity('simulation_run')
export class SimulationRun {
  @PrimaryGeneratedColumn('uuid')
  simulation_run_id: string;

  @ManyToOne(() => SimulationConfig, (config) => config.runs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'simulation_config_id' })
  simulationConfig: SimulationConfig;

  @Column({ type: 'text', nullable: true })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_time: Date;

  @OneToMany(() => LogsResult, (log) => log.simulationRun)
  logs: LogsResult[];

  @OneToOne(() => AnalyzedSimulationResult, (result) => result.simulationRun)
  analysis: AnalyzedSimulationResult;
}
