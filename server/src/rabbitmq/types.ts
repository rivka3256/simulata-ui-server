// // מעטפת הודעה גנרית לכל המערכת
// export interface BaseRabbitMessage<T> {
//   event: string;
//   message_id: string;
//   triggered_at: string;
//   payload: T;
// }

// // ה-Payload המדויק שהג'נרטור בפייתון מצפה לקבל
// export interface SimulationRunPayload {
//   simulation_config_id: string;
//   simulation_name: string;
//   system1_name: string;
//   system2_name: string;
//   message_count: number;
//   message_frequency_hz: number;
// }

// מעטפת הודעה גנרית לכל המערכת
export interface BaseRabbitMessage<T> {
  event: string;
  message_id: string;
  triggered_at: string;
  payload: T;
}

export interface DataWriterPayload {
  data_writer_id: string;
  name: string;
  message_count: number;
  message_frequency_hz: number;
}

export interface DataReaderPayload {
  data_reader_id: string;
  name: string;
  message_count: number;
  message_frequency_hz: number;
}

export interface SimulatedSystem {
  system_name: string;
  dictionary_version: string;
  abc_version: string;
}

export interface GeneratorCodePayload {
  ip_address: string;
  data_writers: DataWriterPayload[]; 
  data_readers: DataReaderPayload[];
}

export interface GeneratorYamlPayload {
  run_id: string;
  simulated_systems: SimulatedSystem[];
}