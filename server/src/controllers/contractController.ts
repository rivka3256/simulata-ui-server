import { Request, Response } from 'express';
import { readData } from '../utils/readWriteData.js';

export const ContractController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const contracts = await readData('contractConfig');
            res.json(contracts);
        } catch (error) {
            res.status(500).json({ message: 'Error reading contracts' });
        }
    },

    getBySystemId: async (req: Request, res: Response) => {
        try {
            const { system_id } = req.params;
            const contracts = await readData('contractConfig');
            const filteredContracts = contracts.filter((c: any) => c.system_id === system_id);
            res.json(filteredContracts);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching contracts by system ID' });
        }
    }
};