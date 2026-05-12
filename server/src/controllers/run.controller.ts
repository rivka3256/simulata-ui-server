import { Request, Response } from 'express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../data/simulationRuns.json');

async function readRuns(): Promise<any[]> {
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

export async function getAllRuns(req: Request, res: Response): Promise<void> {
  try {
    res.json(await readRuns());
  } catch {
    res.status(500).json({ error: 'Failed to load runs' });
  }
}

export async function getRunById(req: Request, res: Response): Promise<void> {
  try {
    const runs = await readRuns();
    const run = runs.find((r) => r.simulation_run_id === req.params.id);
    if (!run) {
      res.status(404).json({ error: 'Run not found' });
      return;
    }
    res.json(run);
  } catch {
    res.status(500).json({ error: 'Failed to load run' });
  }
}

export async function getRunsBySimulation(req: Request, res: Response): Promise<void> {
  try {
    const runs = await readRuns();
    res.json(runs.filter((r) => r.simulation_config_id === req.params.simulationId));
  } catch {
    res.status(500).json({ error: 'Failed to load runs' });
  }
}
