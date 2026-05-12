// ─── New modular API (server-connected) ──────────────────────────────────────
export * from './simulations.api';
export * from './productions.api';
export * from './contracts.api';
export { default as apiClient } from './client';

// ─── Legacy mock API (still used by pages not yet migrated) ──────────────────
export {
  getStats,
  listRuns,
  listScenarios,
  runScenario,
  deleteScenario,
  importYamlSimulation,
  listProfiles,
  createProfile,
  deleteProfile,
  getProfileTopology,
  fetchProfileXml,
  listTemplates,
  generateScenario,
  connectRunWs,
  getRun,
  getRunEvents,
  listSystems,
  listDictionaries,
  createScenario,
} from '../api';

export type {
  Stats,
  RunInfo,
  RunReport,
  AssertionResult,
  TopicStat,
  ScenarioInfo,
  ProfileInfo,
  TopologyInfo,
  TemplateInfo,
  RunEventInfo,
  WsInitMessage,
  SystemInfo,
  Dictionary,
} from '../api';
