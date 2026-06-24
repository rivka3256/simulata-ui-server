
export interface System {
  system_id: string;
  name: string;
  abc_version_id: string; 
  contracts: Contract[]; 
}

export interface DataReader {
  data_reader_id: string;
  contract_config_id: string;
  name: string;
  message_count: number;
  message_frequency_hz: number;
}

export interface DataWriter {
  data_writer_id: string;
  contract_config_id: string;
  name: string;
  message_count: number;
  message_frequency_hz: number;
}

export interface Contract {
  contract_config_id: string;
  system_id: string;
  name: string;
  version: string;
  data_readers: DataReader[]; 
  data_writers: DataWriter[]; 
}

export interface SimulationConfig {
  simulation_config_id: string;
  simulation_name: string;
  created_at: string;
  systems: System[];
}

export interface SimulationRun {
  simulation_run_id: string;
  simulation_config_id: string;
  simulation_name?: string; 
  status: 'Passed' | 'Failed' | 'In Progress';
  start_time: string;      
  end_time: string | null;
  results: {
    success_rate: number;
    errors: number;
    messages_sent?: number;
    messages_received?: number;
  } | null;
  duration_seconds?: number; 
  total_events?: number;
  error_count?: number;
}

export interface WsInitMessage {
  simulation_name: string;
  config: any; 
  status: string;
}