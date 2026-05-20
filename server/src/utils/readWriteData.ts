import fs from 'fs/promises';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const readData = async (fileName: string) => {
    console.log(`Attempting to read data from ${fileName}.json...`);
    const filePath = path.join(__dirname, `../data/${fileName}.json`);
    console.log(`Reading data from ${filePath}...`);
    const data = await fs.readFile(filePath, 'utf-8');
    console.log(`Data read from ${filePath}:`, data);
    return JSON.parse(data);
};

export const writeData = async (fileName: string, data: any) => {
    const filePath = path.join(__dirname, `../data/${fileName}.json`);
    console.log(`Writing data to ${filePath}...`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};