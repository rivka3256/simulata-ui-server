import { Request, Response } from 'express';
import { readData, writeData } from '../utils/readWriteData.js';

export const DataReaderController = {
    getDRByContractId: async (req: Request, res: Response) => {
        try {
            const { contract_config_id } = req.params;
            const dataReaders = await readData('dataReader');
            const filteredDRs = dataReaders.filter((dr: any) => dr.contract_config_id === contract_config_id);
            res.json(filteredDRs);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching Data Readers' });
        }
    },

    updateConfig: async (req: Request, res: Response) => {
        try {
            const { data_reader_id } = req.params;
            const { message_count, message_frequency_hz } = req.body;
            
            const dataReaders = await readData('dataReader');
            const index = dataReaders.findIndex((dr: any) => dr.data_reader_id === data_reader_id);
            
            if (index !== -1) {
                dataReaders[index].message_count = message_count;
                dataReaders[index].message_frequency_hz = message_frequency_hz;
                
                await writeData('dataReader', dataReaders);
                res.json(dataReaders[index]);
            } else {
                res.status(404).json({ message: 'Data Reader not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating Data Reader' });
        }
    }
};