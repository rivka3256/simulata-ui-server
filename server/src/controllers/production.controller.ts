import { Request, Response } from 'express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../data/productionConfigs.json');

async function readProductions(): Promise<any[]> {
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

export async function getAllProductions(req: Request, res: Response): Promise<void> {
  try {
    res.json(await readProductions());
  } catch {
    res.status(500).json({ error: 'Failed to load productions' });
  }
}

export async function getProductionById(req: Request, res: Response): Promise<void> {
  try {
    const productions = await readProductions();
    const production = productions.find((p) => p.production_config_id === req.params.id);
    if (!production) {
      res.status(404).json({ error: 'Production not found' });
      return;
    }
    res.json(production);
  } catch {
    res.status(500).json({ error: 'Failed to load production' });
  }
}
