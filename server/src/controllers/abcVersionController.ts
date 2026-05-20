import { Request, Response } from 'express';
import { readData } from '../utils/readWriteData.js';

export const AbcVersionController = {
    getByContract: async (req: Request, res: Response) => {
        try {
            const { contract_config_id } = req.params;
            const abcVersions = await readData('abcVersion');
            
            // סינון גרסאות ה-ABC ששייכות למילון הספציפי שנבחר
            const filtered = abcVersions.filter((abc: any) => abc.contract_config_id === contract_config_id);
            
            res.json(filtered);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching ABC protocol versions' });
        }
    }
}; 