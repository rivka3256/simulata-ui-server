import client from './client';
import type { ProductionConfig } from './simulations.api';

export async function getAllProductions(): Promise<ProductionConfig[]> {
  const { data } = await client.get('/productions');
  return data;
}

export async function getProductionById(id: string): Promise<ProductionConfig> {
  const { data } = await client.get(`/productions/${id}`);
  return data;
}
