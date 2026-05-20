import { apiFetch } from './client';
import type { AbcVersion } from '../types/api';

// שליפת גרסאות פרוטוקול ABC לפי מזהה מילון
export const getAbcVersionsByContract = async (contractId: string): Promise<AbcVersion[]> => {
  return apiFetch<AbcVersion[]>(`/abc-versions/contract/${contractId}`);
}; 