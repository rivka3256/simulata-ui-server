// import { BaseRabbitMessage, SimulationRunPayload } from '../types.js';

// export function buildSimulationRunMessage(
//   simulation: any,
//   runId: string,
//   system1Name: string,
//   system2Name: string,
//   messageCount: number,
//   messageFrequencyHz: number
// ): BaseRabbitMessage<SimulationRunPayload> {
  
//   return {
//     event: 'simulation.run',
//     message_id: runId,
//     triggered_at: new Date().toISOString(),
//     payload: {
//       simulation_config_id: simulation.simulation_config_id,
//       simulation_name: simulation.simulation_name,
//       system1_name: system1Name,
//       system2_name: system2Name,
//       message_count: messageCount,
//       message_frequency_hz: messageFrequencyHz,
//     },
//   };
// }

import { 
  BaseRabbitMessage, 
  GeneratorCodePayload, 
  GeneratorYamlPayload, 
  DataWriterPayload, 
  DataReaderPayload, 
  SimulatedSystem 
} from '../../rabbitmq/types.js';

export function buildGeneratorCodeMessage(
  runId: string,
  ipAddress: string,
  dataWritersArray: DataWriterPayload[],
  dataReadersArray: DataReaderPayload[] 
): BaseRabbitMessage<GeneratorCodePayload> {
  
  return {
    event: 'simulation.run.code',
    message_id: runId, // מזהה ההרצה משמש גם כמזהה ההודעה למעקב
    triggered_at: new Date().toISOString(),
    payload: {
      ip_address: ipAddress,
      data_writers: dataWritersArray,
      data_readers: dataReadersArray
    },
  };
}

export function buildGeneratorYamlMessage(
  runId: string,
  simulatedSystemsArray: SimulatedSystem[]
): BaseRabbitMessage<GeneratorYamlPayload> {
  
  return {
    event: 'simulation.run.yaml',
    message_id: runId,
    triggered_at: new Date().toISOString(),
    payload: {
      run_id: runId,
      simulated_systems: simulatedSystemsArray
    },
  };
}