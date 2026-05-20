export interface System {
  system_id: string;
  name: string;
  description: string;
}

export interface Contract {
  contract_config_id: string;
  system_id: string;
  name: string;
  version: string;
}

export interface DataEntity {
  data_reader_id?: string;
  data_writer_id?: string;
  entity_id?: string; // שדה עזר משולב
  contract_config_id: string;
  name: string;
  message_count: number;
  message_frequency_hz: number;
  type?: 'reader' | 'writer'; // מאפשר ל-UI לדעת בקלות מה סוג הרכיב
}

// 🌟 טיפוס חדש לגרסאות פרוטוקול ABC
export interface AbcVersion {
  abc_version_id: string; 
  contract_config_id: string;
  abc_version_name: string;
  release_date?: string;
}

// 🌟 המבנה החדש והמשולב של קונפיגורציית סימולציה
export interface SimulationConfig {
  simulation_config_id: string;
  simulation_name: string;
  created_at: string;
  configuration_details: {
    systems: Array<{
      system_id: string;
      contract_config_id: string;
      abc_version_id: string; // ה-Dropdown החדש!
      entities: Array<{
        entity_id: string; // המזהה של ה-DR או ה-DW
        name: string;
        type: 'reader' | 'writer';
        message_count: number;
        message_frequency_hz: number;
      }>;
    }>;
  };
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