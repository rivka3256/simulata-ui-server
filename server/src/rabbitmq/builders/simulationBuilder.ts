import { BaseRabbitMessage, SimulationRunPayload } from '../types.js';

export function buildSimulationRunMessage(
  simulation: any,
  runId: string,
  system1Name: string,
  system2Name: string,
  messageCount: number,
  messageFrequencyHz: number
): BaseRabbitMessage<SimulationRunPayload> {
  
  return {
    event: 'simulation.run',
    message_id: runId,
    triggered_at: new Date().toISOString(),
    payload: {
      simulation_config_id: simulation.simulation_config_id,
      simulation_name: simulation.simulation_name,
      system1_name: system1Name,
      system2_name: system2Name,
      message_count: messageCount,
      message_frequency_hz: messageFrequencyHz,
    },
  };
}