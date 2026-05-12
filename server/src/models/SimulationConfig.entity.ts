import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { SimulationRun } from './SimulationRun.entity.js';
import { ProductionConfig } from './ProductionConfig.entity.js';

@Entity('simulation_config')
export class SimulationConfig {
  @PrimaryGeneratedColumn('uuid')
  simulation_config_id: string;

  @Column({ type: 'text' })
  scenario_name: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => SimulationRun, (run) => run.simulationConfig)
  runs: SimulationRun[];

  @ManyToMany(() => ProductionConfig)
  @JoinTable({
    name: 'production_in_simulation',
    joinColumn: { name: 'simulation_config_id', referencedColumnName: 'simulation_config_id' },
    inverseJoinColumn: { name: 'production_id', referencedColumnName: 'production_config_id' }
  })
  productions: ProductionConfig[];
}
