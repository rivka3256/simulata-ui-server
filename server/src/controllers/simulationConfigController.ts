
import { Request, Response } from 'express';
import { readData, writeData } from '../utils/readWriteData.js';
import { v4 as uuidv4 } from 'uuid';

export const SimulationConfigController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const simulations = await readData('simulationsConfig');
            res.json(simulations);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching simulations' });
        }
    },

    getSimulationsNames: async (req: Request, res: Response) => {
        try {
            const simulations = await readData('simulationsConfig');
            res.json(simulations.map((s: any) => s.simulation_name));
        } catch (error) {
            res.status(500).json({ message: 'Error fetching simulations names' });
        }
    },

    // 🌟 החזרתי את הפונקציה הזו עבור ה-UI שלך!
    getById: async (req: Request, res: Response) => {
        try {
            const { simulation_config_id } = req.params;
            const simulations = await readData('simulationsConfig');
            const simulation = simulations.find((s: any) => s.simulation_config_id === simulation_config_id);
            simulation ? res.json(simulation) : res.status(404).json({ message: 'Simulation not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching simulation' });
        }
    },

    getByName: async (req: Request, res: Response) => {
        try {
            const { simulation_name } = req.params;
            const simulations = await readData('simulationsConfig');
            const simulation = simulations.find((s: any) => s.simulation_name === simulation_name);
            simulation ? res.json(simulation) : res.status(404).json({ message: 'Simulation not found' });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching simulation' });
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const { simulation_name, configuration_details } = req.body;
            const simulations = await readData('simulationsConfig');
            
            if (simulations.some((s: any) => s.simulation_name === simulation_name)) {
                return res.status(400).json({ message: 'Simulation name already exists. Please choose a unique name.' });
            }

            const newSimulation = {
                simulation_config_id: uuidv4(),
                simulation_name,
                configuration_details, 
                created_at: new Date().toISOString()
            };

            simulations.push(newSimulation);
            await writeData('simulationsConfig', simulations);
            res.status(201).json(newSimulation);
        } catch (error) {
            res.status(500).json({ message: 'Error saving simulation configuration' });
        }
    },

update: async (req: Request, res: Response) => {
    try {
        const { simulation_config_id } = req.params;
        const simulations = await readData('simulationsConfig'); 
        const index = simulations.findIndex((s: any) => s.simulation_config_id === simulation_config_id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Simulation configuration not found' });
        }

        const existingSimulation = simulations[index];
        
        // 🔥 התיקון: שולפים גם את ה-simulation_name מהגוף של הבקשה!
        const { simulation_name, configuration_details } = req.body;
        const updatedSimulation = { ...existingSimulation };

        // 🔥 התיקון: אם נשלח שם חדש, מעדכנים אותו באובייקט
        if (simulation_name !== undefined) {
            updatedSimulation.simulation_name = simulation_name;
        }

        if (configuration_details !== undefined) {
            updatedSimulation.configuration_details = configuration_details;
        }

        simulations[index] = updatedSimulation;
        await writeData('simulationsConfig', simulations);
        res.json(updatedSimulation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating simulation configuration' });
    }
},
    delete: async (req: Request, res: Response) => {
        try {
            const { simulation_config_id } = req.params;
            let simulations = await readData('simulationsConfig');
            simulations = simulations.filter((s: any) => s.simulation_config_id !== simulation_config_id);
            await writeData('simulationsConfig', simulations);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting simulation' });
        }
    }
};