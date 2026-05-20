// מעטפת הודעה גנרית לכל המערכת
export interface BaseRabbitMessage<T> {
  event: string;
  message_id: string;
  triggered_at: string;
  payload: T;
}

// ה-Payload המדויק שהג'נרטור בפייתון מצפה לקבל
export interface SimulationRunPayload {
  simulation_config_id: string;
  simulation_name: string;
  system1_name: string;
  system2_name: string;
  message_count: number;
  message_frequency_hz: number;
}