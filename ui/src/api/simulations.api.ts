import client from './client';

export interface SimulationConfig {
  simulation_config_id: string;
  scenario_name: string;
  created_at: string;
  productions: ProductionConfig[];
}

export interface ProductionConfig {
  production_config_id: string;
  contracts: ContractConfig[];
}

export interface ContractConfig {
  contract_config_id: string;
  version: string;
  dataReader?: { message_count: number; message_frequency_hz: number };
  dataWriter?: { message_count: number; message_frequency_hz: number };
}

export interface CreateSimulationPayload {
  simulation_config_id?: string;
  scenario_name: string;
  productions: {
    contracts: {
      version: string;
      dataWriter?: { message_count: number; message_frequency_hz: number };
      dataReader?: { message_count: number; message_frequency_hz: number };
    }[];
  }[];
}

export async function getAllSimulations(): Promise<SimulationConfig[]> {
  const { data } = await client.get('/simulations');
  return data;
}

export async function getSimulationById(id: string): Promise<SimulationConfig> {
  const { data } = await client.get(`/simulations/${id}`);
  return data;
}

export async function createSimulation(payload: CreateSimulationPayload): Promise<SimulationConfig> {
  const { data } = await client.post('/simulations', payload);
  return data;
}
