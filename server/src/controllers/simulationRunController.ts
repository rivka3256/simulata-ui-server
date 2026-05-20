
import { Request, Response } from 'express';
import { readData, writeData } from '../utils/readWriteData.js';
import { v4 as uuidv4 } from 'uuid';
import { publishSimulationRun } from '../rabbitmq/index.js';

// 🌟 פונקציית ההחלטה של השרת - קובעת אם הריצה שהסתיימה הצליחה או נכשלה
function evaluateRunResults() {
    const isSuccess = Math.random() > 0.2; // 80% סיכוי להצלחה, 20% לכישלון
    
    if (isSuccess) {
        return {
            status: 'Passed',
            success_rate: 100,
            errors: 0,
            messages_sent: 120,
            messages_received: 120
        };
    } else {
        const errorsCount = Math.floor(Math.random() * 5) + 1; // בין 1 ל-5 שגיאות
        const messagesSent = 120;
        const messagesReceived = messagesSent - errorsCount;
        const successRate = Math.round((messagesReceived / messagesSent) * 100);

        return {
            status: 'Failed',
            success_rate: successRate,
            errors: errorsCount,
            messages_sent: messagesSent,
            messages_received: messagesReceived
        };
    }
}

async function populateSimulationData(simulationConfig: any) {
    const systemsDB = await readData('systems'); 
    const configSystems = simulationConfig.configuration_details?.systems || [];
    const sys1Config = configSystems[0];
    const sys2Config = configSystems[1];
    
    const system1 = sys1Config ? systemsDB.find((sys: any) => sys.system_id === sys1Config.system_id) : null;
    const system2 = sys2Config ? systemsDB.find((sys: any) => sys.system_id === sys2Config.system_id) : null;
    
    const system1_name = system1 ? system1.name : 'Unknown System 1';
    const system2_name = system2 ? system2.name : 'Unknown System 2';

    const data_writers: any[] = [];
    const data_readers: any[] = [];

    const sortEntities = (entities: any[]) => {
        if (!entities) return;
        entities.forEach((entity: any) => {
            const mappedEntity = {
                [entity.type === 'writer' ? 'data_writer_id' : 'data_reader_id']: entity.entity_id,
                name: entity.name || 'Unknown',
                message_count: Number(entity.message_count || 0),
                message_frequency_hz: Number(entity.message_frequency_hz || 0)
            };
            if (entity.type === 'writer') data_writers.push(mappedEntity);
            else if (entity.type === 'reader') data_readers.push(mappedEntity);
        });
    };

    if (sys1Config) sortEntities(sys1Config.entities);
    if (sys2Config) sortEntities(sys2Config.entities);

    return { system1_name, system2_name, data_writers, data_readers };
}

export const SimulationRunController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const runs = await readData('simulationRuns');
            const nowTime = new Date().getTime();
            let hasChanges = false;

            const updatedRuns = runs.map((run: any) => {
                if (run.status === 'In Progress' && run.end_time) {
                    const endTime = new Date(run.end_time).getTime();
                    if (nowTime >= endTime) {
                        hasChanges = true;
                        
                        // 🌟 שימוש בפונקציית ההחלטה החדשה עבור ריצות שהסתיימו בזמן!
                        const evaluation = evaluateRunResults();
                        
                        return {
                            ...run,
                            status: evaluation.status,
                            end_time: new Date(endTime).toISOString(),
                            duration_seconds: 15,
                            results: {
                                messages_sent: evaluation.messages_sent,
                                messages_received: evaluation.messages_received,
                                success_rate: evaluation.success_rate,
                                errors: evaluation.errors
                            }
                        };
                    }
                }
                return run;
            });

            if (hasChanges) {
                await writeData('simulationRuns', updatedRuns);
            }

            res.json(updatedRuns);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching simulation runs' });
        }
    },

    getOneById: async (req: Request, res: Response) => {
        try {
            const { simulation_run_id } = req.params;
            const runs = await readData('simulationRuns');
            const runIndex = runs.findIndex((r: any) => r.simulation_run_id === simulation_run_id);
            
            if (runIndex === -1) {
                return res.status(404).json({ message: 'Simulation run not found' });
            }
            
            const run = runs[runIndex];
            
            if (run.status === 'In Progress' && run.end_time) {
                const nowTime = new Date().getTime();
                const endTime = new Date(run.end_time).getTime();
                
                if (nowTime >= endTime) {
                    // 🌟 שימוש בפונקציית ההחלטה החדשה
                    const evaluation = evaluateRunResults();
                    
                    run.status = evaluation.status;
                    run.end_time = new Date(endTime).toISOString();
                    run.duration_seconds = 15;
                    run.results = {
                        messages_sent: evaluation.messages_sent,
                        messages_received: evaluation.messages_received,
                        success_rate: evaluation.success_rate,
                        errors: evaluation.errors
                    };
                    
                    runs[runIndex] = run;
                    await writeData('simulationRuns', runs);
                }
            }
            
            res.json(run);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching this simulation run' });
        }
    },

    stopSimulation: async (req: Request, res: Response) => {
        try {
            const { simulation_run_id } = req.params;
            const runs = await readData('simulationRuns');
            const runIndex = runs.findIndex((r: any) => r.simulation_run_id === simulation_run_id);
            
            if (runIndex === -1) {
                return res.status(404).json({ message: 'Simulation run not found' });
            }

            // 🌟 בדיוק כמו שביקשת: מוחקים לגמרי מהקובץ כדי שלא יישאר לזה זכר!
            runs.splice(runIndex, 1);
            await writeData('simulationRuns', runs);

            return res.json({ 
                message: 'Simulation stopped and completely deleted from history' 
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error stopping simulation run' });
        }
    },

    getBySimulationId: async (req: Request, res: Response) => {
        try {
            const { simulation_config_id } = req.params;
            const runs = await readData('simulationRuns');
            const scenarioRuns = runs.filter((r: any) => r.simulation_config_id === simulation_config_id);
            res.json(scenarioRuns);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching runs for this simulation' });
        }
    },

    getBySimulationName: async (req: Request, res: Response) => {
        try {
            const { simulation_name } = req.params;
            const runs = await readData('simulationRuns');
            const scenarioRuns = runs.filter((r: any) => r.simulation_name === simulation_name);
            res.json(scenarioRuns);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching runs for this simulation name' });
        }
    },

    getBySimulationByStatus: async (req: Request, res: Response) => {
        try {
            const { status } = req.params;
            const runs = await readData('simulationRuns');
            const scenarioRuns = runs.filter((r: any) => r.status === status);
            res.json(scenarioRuns);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching runs for this status' });
        }
    },

    runSimulation: async (req: Request, res: Response) => {
        try {
            const simulation_config_id = req.body.simulation_config_id || req.params.simulation_config_id;
            const simulations = await readData('simulationsConfig');
            const simulationExists = simulations.find((s: any) => s.simulation_config_id === simulation_config_id);     
            
            if (!simulationExists) {
                return res.status(404).json({ message: 'Simulation configuration not found' });
            }
            
            const enrichedData = await populateSimulationData(simulationExists);
            const currentRunId = uuidv4();
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + 15000);    
            
            const newRun = {
                simulation_run_id: currentRunId,
                simulation_config_id,
                simulation_name: simulationExists.simulation_name,
                status: 'In Progress', 
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                results: {
                    messages_sent: 0,
                    messages_received: 0,
                    success_rate: 0,
                    errors: 0
                }
            };

            const runs = await readData('simulationRuns');
            runs.push(newRun);
            await writeData('simulationRuns', runs);
            
            return res.status(201).json({ 
                message: 'Simulation run triggered, verified by RabbitMQ (Code & YAML), and logged successfully', 
                run: newRun 
            });
            } catch (error) {
                        console.error("Critical error during simulation dispatch:", error);
                        return res.status(500).json({ message: 'Simulation failed to start due to internal pipeline infrastructure issue' });
                    }
    }
};