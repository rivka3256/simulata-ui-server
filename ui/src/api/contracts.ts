

import { apiFetch } from './client';
import type { Contract, DataEntity } from '../types/api';

// קבלת כל המילונים
export const getAllContracts = (): Promise<Contract[]> => {
  return apiFetch('/contracts');
};
 
// שליפת הרכיבים המשולבים
export const getContractEntities = async (contractId: string): Promise<DataEntity[]> => {
  try {
    // קריאה לראוט המאוחד
    const res = await apiFetch<any>(`/components/contract/${contractId}`);
    
    // בדיקה והדפסה ל-Console כדי שתראי בעיניים מה השרת מחזיר!
    console.log("Raw API Response from /components/contract:", res);

    // חילוץ בטוח: בודק אם זה עטוף ב-res.data או נמצא ישירות ב-res
    const targetData = res?.data ? res.data : res;

    const rawReaders = targetData?.dataReaders || [];
    const rawWriters = targetData?.dataWriters || [];

    // מיפוי קוראים
    const readers = rawReaders.map((dr: any) => ({
      ...dr,
      type: 'reader' as const,
      entity_id: dr.data_reader_id
    }));

    // מיפוי כותבים (כולל עקיפת בעיית השמות של ה-JSON)
    const writers = rawWriters.map((dw: any) => ({
      ...dw,
      type: 'writer' as const,
      entity_id: dw.data_writer_id || dw.data_reader_id
    }));

    const finalResult = [...readers, ...writers];
    console.log("Mapped entities for UI rendering:", finalResult);
    
    return finalResult;
  } catch (error) {
    console.error("Failed to fetch contract entities in API layer:", error);
    return [];
  }
};