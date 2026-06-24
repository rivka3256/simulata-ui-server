import { apiFetch } from './client';
import type { SimulationRun } from '../types/api';

export async function getAllRuns() {
    return apiFetch<SimulationRun[]>('/runs');
}

export async function getRunsBySimulationId(simulationConfigId: string) {
    return apiFetch<SimulationRun[]>(`/runs/simulation/${simulationConfigId}`);
}

export async function getRunById(runId: string) {
    // הוספת סימן שאלה וזמן נוכחי בשביל לעקוף את המטמון (Cache) של הדפדפן
    return apiFetch<SimulationRun>(`/runs/${runId}?_t=${Date.now()}`);
}

export async function getRunEvents(runId: string) {
    return apiFetch<any[]>(`/runs/${runId}/events`);
}  

export async function stopRun(runId: string) {
    return apiFetch<any>(`/runs/${runId}/stop`, {
        method: 'POST'
    });
}