import { Request, Response } from 'express';
import { readData } from '../utils/readWriteData.js';

export const SystemController = {
    getAll: async (req: Request, res: Response) => {
        try {
            console.log("Fetching all systems...");
            const systems = await readData('systems');
            console.log("Systems data retrieved:", systems);
            res.json(systems);
        } catch (error) {
            console.error("💥 Error in getAll systems:", error);
            res.status(500).json({ message: 'Error reading systems data' });
        }
    }

    // GPP של api נשאר עוד להוסיף את הפונקציה שמחזירה את זוגות המערכות הקיימות מ
};