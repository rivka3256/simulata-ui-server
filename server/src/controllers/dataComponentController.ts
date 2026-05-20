import { Request, Response } from 'express';
import { readData, writeData } from '../utils/readWriteData.js';

export const DataComponentController = {
  getComponentsByContractId: async (req: Request, res: Response) => {
        try {
            const { contract_config_id } = req.params; 

            console.log(`\n==================================================`);
            console.log(`[Backend] Incoming contract_config_id from UI: "${contract_config_id}"`);

            const dataReaders = await readData('dataReader');
            const dataWriters = await readData('dataWriter');

            // 🌟 התיקון הקריטי: חילוץ המזהה הבסיסי (למשל מתוך "cont-1-v1.3" ניקח רק את "cont-1")
            // אם המזהה מכיל מקפים (כמו cont-1-v1.3), נחתוך אותו ונשמור רק את החלקים של המזהה הבסיסי
            const targetBaseId = contract_config_id.includes('-v') 
                ? contract_config_id.split('-v')[0] 
                : contract_config_id;

            console.log(`[Backend] Extracted base ID for filtering: "${targetBaseId}"`);

            // סינון גמיש שבודק התאמה למזהה הבסיסי או חלקיות
            const filteredDRs = dataReaders.filter((dr: any) => {
                const drId = String(dr.contract_config_id);
                return drId === targetBaseId || drId === contract_config_id || contract_config_id.startsWith(drId);
            }); 

            const filteredDWs = dataWriters.filter((dw: any) => {
                const dwId = String(dw.contract_config_id);
                return dwId === targetBaseId || dwId === contract_config_id || contract_config_id.startsWith(dwId);
            });

            console.log(`[Backend] SUCCESS: Found ${filteredDRs.length} Readers and ${filteredDWs.length} Writers`);
            console.log(`==================================================\n`);

            res.json({
                dataReaders: filteredDRs,
                dataWriters: filteredDWs
            });
        } catch (error) {
            console.error('[Backend] Error fetching Data Components:', error);
            res.status(500).json({ message: 'Error fetching Data Components' });
        }
    },

    updateConfig: async (req: Request, res: Response) => {
        try {
            const { component_type, component_id } = req.params;
            const { message_count, message_frequency_hz } = req.body;
            
            const fileName = component_type === 'DR' ? 'dataReader' : 'dataWriter';
            const components = await readData(fileName);
            
            const index = components.findIndex((comp: any) => 
                String(comp.data_reader_id) === String(component_id) || 
                String(comp.data_writer_id) === String(component_id)
            );
            
            if (index !== -1) {
                components[index].message_count = Number(message_count);
                components[index].message_frequency_hz = Number(message_frequency_hz);
                
                await writeData(fileName, components);
                res.json(components[index]);
            } else {
                res.status(404).json({ message: `Data ${component_type} not found` });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating Data Component' });
        }
    }
};