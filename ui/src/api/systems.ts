import { apiFetch } from './client';
import type { System } from '../types/api';

export async function getAllSystems() {
    return apiFetch<System[]>('/systems');
} 