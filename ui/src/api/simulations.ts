import { apiFetch } from './client';
import type { SimulationConfig } from '../types/api';

export async function getAllSimulations() {
    return apiFetch<SimulationConfig[]>('/simulations');
}

export async function getSimulationById(id: string) {
    return apiFetch<SimulationConfig>(`/simulations/${id}`);
}

export async function createSimulation(data: Partial<SimulationConfig>) {
    return apiFetch<SimulationConfig>('/simulations', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateSimulation(id: string, data: Partial<SimulationConfig>) {
    return apiFetch<SimulationConfig>(`/simulations/${id}`, {
        method: 'PUT', // או PATCH, תלוי בשרת שלך
        body: JSON.stringify(data),
    });
}
 
export async function deleteSimulation(id: string) {
    return apiFetch<void>(`/simulations/${id}`, {
        method: 'DELETE',
    }); 
} 

export async function runSimulation(id: string) {
    // console.log(`[API] Starting simulation with ID: ${id}`);
    return apiFetch<{ status: string, run: { simulation_run_id: string } }>(`/runs/simulations/${id}/run`, {
        method: 'POST',
    });
}

export async function importYamlSimulation(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch<SimulationConfig>('/simulations/import', {
        method: 'POST',
        body: formData, // apiFetch צריך לדעת לטפל ב-FormData
    });
}