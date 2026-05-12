import client from './client';
import type { ContractConfig } from './simulations.api';

export async function getRunsBySimulation(simulationId: string): Promise<any[]> {
  const { data } = await client.get(`/simulations/${simulationId}/runs`);
  return data;
}

export async function getContractById(id: string): Promise<ContractConfig> {
  const { data } = await client.get(`/contracts/${id}`);
  return data;
}
