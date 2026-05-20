import { Request, Response } from 'express';
import { readData, writeData } from '../utils/readWriteData.js';

export const DataWriterController = {
    getDWByContractId: async (req: Request, res: Response) => {
        try {
            const { contract_config_id } = req.params;
            const dataWriters = await readData('dataWriter');
            const filteredDWs = dataWriters.filter((dw: any) => dw.contract_config_id === contract_config_id);
            res.json(filteredDWs);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching Data Writers' });
        }
    },

    updateConfig: async (req: Request, res: Response) => {
        try {
            const { data_writer_id } = req.params;
            const { message_count, message_frequency_hz } = req.body;
            
            const dataWriters = await readData('dataWriter');
            const index = dataWriters.findIndex((dw: any) => dw.data_writer_id === data_writer_id);
            
            if (index !== -1) {
                dataWriters[index].message_count = message_count;
                dataWriters[index].message_frequency_hz = message_frequency_hz;
                
                await writeData('dataWriter', dataWriters);
                res.json(dataWriters[index]);
            } else {
                res.status(404).json({ message: 'Data Writer not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating Data Writer' });
        }
    }
};