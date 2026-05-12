import { Request, Response } from 'express';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../data/simulations.json');

async function readSimulations(): Promise<any[]> {
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

export async function getAllSimulations(req: Request, res: Response): Promise<void> {
  try {
    res.json(await readSimulations());
  } catch {
    res.status(500).json({ error: 'Failed to load simulations' });
  }
}

export async function getSimulationById(req: Request, res: Response): Promise<void> {
  try {
    const simulations = await readSimulations();
    const simulation = simulations.find((s) => s.simulation_config_id === req.params.id);
    if (!simulation) {
      res.status(404).json({ error: 'Simulation not found' });
      return;
    }
    res.json(simulation);
  } catch {
    res.status(500).json({ error: 'Failed to load simulation' });
  }
}

export async function createSimulation(req: Request, res: Response): Promise<void> {
  console.log("📥 Received new simulation at Server:", JSON.stringify(req.body, null, 2));
  try {
    const { scenario_name, simulation_config_id, productions } = req.body;
    if (!scenario_name) {
      res.status(400).json({ error: 'scenario_name is required' });
      return;
    }
    const simulations = await readSimulations();
    const newSimulation = {
      simulation_config_id: simulation_config_id || crypto.randomUUID(),
      scenario_name,
      created_at: new Date().toISOString(),
      productions: productions ?? [],
    };
    simulations.push(newSimulation);
    await writeFile(filePath, JSON.stringify(simulations, null, 2), 'utf-8');
    res.status(201).json(newSimulation);
  } catch {
    res.status(500).json({ error: 'Failed to create simulation' });
  }
}
