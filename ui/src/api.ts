// ─── Types ────────────────────────────────────────────────────────────────────

export interface Stats {
  total_runs: number;
  passed: number;
  failed: number;
  pass_rate: number;
}

export interface RunInfo {
  id: string;
  simulation_name: string;
  status: string;
  duration_seconds: number;
  total_events: number;
  error_count: number;
  started_at: string;
  test_scenario_id?: string;
  errors?: string[];
  config_snapshot?: Record<string, any>;
  report?: RunReport;
  message_summary?: Record<string, any>;
}

export interface RunReport {
  assertion_results: AssertionResult[];
  deployment_health: Record<string, { initialized: boolean }>;
  topic_stats?: Record<string, TopicStat>;
}

export interface AssertionResult {
  assertion_type: string;
  passed: boolean;
  scope?: string;
  message: string;
}

export interface TopicStat {
  sent: number;
  received: number;
  lost: number;
  rejected?: number;
  loss_percent: number;
}

// עדכון הממשק של הקונפיגורציה להכלת המערכות
export interface ScenarioConfig {
  source_system?: string;    // הוסף עבור בחירת מערכת מקור
  target_system?: string;    // הוסף עבור בחירת מערכת יעד
  transport_latency_ms?: number;
  transport_jitter_ms?: number;
  phases?: Array<{
    name: string;
    actions: Array<{
      type: string;
      params?: {
        count?: number;
        frequency?: number;
      };
    }>;
  }>;
  assertions?: Array<{
    type: string;
    scope?: string;
  }>;
}

export interface ScenarioInfo {
  id: string;
  simulation_config_id?: string; 
  name: string;
  scenario_name?: string; 
  description?: string;
  last_run?: string;
  dds_profile_id?: string;
  scenario_config?: ScenarioConfig; // שימוש בטיפוס המעודכן
}

export interface ProfileInfo {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  profile_data?: Record<string, any>;
}

export interface TopologyInfo {
  domains: { name: string; domain_id: number }[];
  topics: { name: string; type_ref: string }[];
  participants: {
    name: string;
    domain_id: number;
    writers: { name: string; topic: string }[];
    readers: { name: string; topic: string }[];
  }[];
}

export interface TemplateInfo {
  name: string;
  description: string;
}

export interface RunEventInfo {
  id?: string;
  timestamp: string;
  severity: string;
  category: string;
  topic?: string;
  message: string;
  participant?: string;
  endpoint?: string;
}

export interface WsInitMessage {
  simulation_name: string;
  config?: Record<string, any>;
  status: string;
}

// טיפוס חדש עבור המערכות
export interface SystemInfo {
  id: string;
  name: string;
}

export interface Dictionary {
  id: string;
  systemId: string;
  name: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

// רשימת מערכות דמה

const MOCK_SYSTEMS: SystemInfo[] = [
  { id: "sys-1", name: "NAVAL_COMMAND_CENTER" },
  { id: "sys-2", name: "RADAR_SUBSYSTEM_A" },
  { id: "sys-3", name: "SONAR_INTEGRATION_HUB" },
  { id: "sys-4", name: "FLEET_MONITOR_V2" },
];

export const listDictionaries = async (): Promise<Dictionary[]> => {
  return [
    // כאן התיקון: ה-systemId חייב להיות sys-1 כדי להתאים למערכת NAVAL
    { id: 'd1', systemId: 'sys-1', name: 'NAVAL_Protocols_v1' },
    { id: 'd2', systemId: 'sys-1', name: 'NAVAL_Weapon_Specs' },
    { id: 'd3', systemId: 'sys-2', name: 'RADAR_Frequency_Map' },
    { id: 'd4', systemId: 'sys-2', name: 'RADAR_Target_Types' },
    { id: 'd5', systemId: 'sys-3', name: 'SONAR_Depth_Tables' },
  ];
};

const MOCK_SCENARIOS: ScenarioInfo[] = [
  {
    id: "sim-1",
    simulation_config_id: "sim-1",
    name: "GridOps Full Test",
    scenario_name: "GridOps Full Test",
    description: "End-to-end grid operations simulation",
    dds_profile_id: "profile-1",
    scenario_config: { 
      source_system: "sys-1", // הוספת נתוני דמה
      target_system: "sys-2", // הוספת נתוני דמה
      transport_latency_ms: 10,
      transport_jitter_ms: 5,
      phases: [
        {
          name: "setup",
          actions: [
            { type: "send_messages", params: { count: 5, frequency: 1 } }
          ]
        },
        {
          name: "test execution",
          actions: [
            { type: "send_messages", params: { count: 100, frequency: 10 } },
            { type: "read_messages", params: { count: 100, frequency: 10 } }
          ]
        }
      ], 
      assertions: [
        { type: "delivery_complete", scope: "all" },
        { type: "no_errors", scope: "all" },
        { type: "all_matched", scope: "all" }
      ] 
    },
  },
  {
    id: "sim-2",
    simulation_config_id: "sim-2",
    name: "Analysis Wizard",
    scenario_name: "Analysis Wizard",
    description: "Analyze data merge margins",
    dds_profile_id: "profile-2",
    scenario_config: { 
      transport_latency_ms: 20,
      transport_jitter_ms: 10,
      phases: [
        {
          name: "test execution",
          actions: [
            { type: "send_messages", params: { count: 50, frequency: 5 } }
          ]
        }
      ], 
      assertions: [
        { type: "delivery_complete", scope: "all" },
        { type: "no_errors", scope: "all" }
      ] 
    },
  },
  {
    id: "sim-3",
    simulation_config_id: "sim-3",
    name: "Odin System Check",
    scenario_name: "Odin System Check",
    description: "Ships monitoring & diagnostics",
    dds_profile_id: "profile-1",
    scenario_config: { 
      transport_latency_ms: 0,
      transport_jitter_ms: 0,
      phases: [
        {
          name: "setup",
          actions: [
            { type: "send_messages", params: { count: 10, frequency: 1 } }
          ]
        },
        {
          name: "test execution",
          actions: [
            { type: "send_messages", params: { count: 200, frequency: 20 } },
            { type: "read_messages", params: { count: 200, frequency: 20 } }
          ]
        }
      ], 
      assertions: [
        { type: "all_matched", scope: "all" }
      ] 
    },
  },
  {
    id: "sim-4",
    simulation_config_id: "sim-4",
    name: "Tesla Integration",
    scenario_name: "Tesla Integration",
    description: "Sync and exchange recordings",
    dds_profile_id: undefined,
    scenario_config: { 
      transport_latency_ms: 0,
      transport_jitter_ms: 0,
      phases: [
        {
          name: "test execution",
          actions: [
            { type: "send_messages", params: { count: 10, frequency: 1 } }
          ]
        }
      ], 
      assertions: [] 
    },
  },
];


const MOCK_PROFILES: ProfileInfo[] = [
  {
    id: "profile-1",
    name: "System Default",
    description: "System Description 10 Gb Simulation",
    created_at: "2024-11-01T10:00:00Z",
    profile_data: {
      participant_libraries: [
        {
          participants: [
            {
              name: "Publisher_A",
              writers: [{ topic: "SensorData", qos_ref: "default" }],
              readers: [],
            },
            {
              name: "Subscriber_B",
              writers: [],
              readers: [{ topic: "SensorData", qos_ref: "default" }],
            },
          ],
        },
      ],
      domain_libraries: [
        {
          domains: [
            {
              topics: [
                { name: "SensorData" },
                { name: "CommandData" },
                { name: "GlobalStatus" },
              ],
            },
          ],
        },
      ],
      qos_libraries: [{ profiles: [{}, {}] }],
    },
  },
  {
    id: "profile-2",
    name: "Analysis Config",
    description: "System Description 10 Gb Simulation",
    created_at: "2024-11-15T08:30:00Z",
    profile_data: {
      participant_libraries: [
        { participants: [{ name: "Analyzer_1" }, { name: "Collector_2" }] },
      ],
      domain_libraries: [{ domains: [{ topics: [{ name: "MetricsTopic" }] }] }],
      qos_libraries: [{ profiles: [{}] }],
    },
  },
];

const MOCK_RUNS: RunInfo[] = [
  {
    id: "run-1",
    simulation_name: "GridOps Full Test",
    status: "passed",
    duration_seconds: 4.231,
    total_events: 312,
    error_count: 0,
    started_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    test_scenario_id: "sim-1",
    report: {
      assertion_results: [
        { assertion_type: "delivery_complete", passed: true, scope: "all", message: "All messages delivered" },
        { assertion_type: "no_errors", passed: true, scope: "all", message: "No errors detected" },
        { assertion_type: "all_matched", passed: true, scope: "all", message: "All endpoints matched" },
      ],
      deployment_health: {
        Publisher_A: { initialized: true },
        Subscriber_B: { initialized: true },
      },
      topic_stats: {
        SensorData: { sent: 100, received: 100, lost: 0, loss_percent: 0 },
      },
    },
  },
  // ... שאר ה-MOCK_RUNS נשארים אותו דבר
];

const MOCK_EVENTS: RunEventInfo[] = [
  { id: "e1", timestamp: "2024-11-01T10:00:00.001Z", severity: "info", category: "participant_created", topic: "", message: "Publisher_A initialized on domain 0" },
  { id: "e2", timestamp: "2024-11-01T10:00:00.050Z", severity: "info", category: "participant_created", topic: "", message: "Subscriber_B initialized on domain 0" },
  { id: "e10", timestamp: "2024-11-01T10:00:02.000Z", severity: "error", category: "error", topic: "", message: "QoS negotiation failed briefly" },
];

const MOCK_CONFIG = {
  topics: [
    { name: "SensorData", fields: [{ name: "timestamp", type: "int64" }, { name: "value", type: "float64" }] },
    { name: "CommandData", fields: [{ name: "cmd_id", type: "string" }] },
  ],
  participants: [
    { name: "Publisher_A", writers: [{ topic: "SensorData" }, { topic: "CommandData" }], readers: [] },
    { name: "Subscriber_B", writers: [], readers: [{ topic: "SensorData" }] },
    { name: "Controller_C", writers: [], readers: [{ topic: "CommandData" }] },
  ],
};

// ─── Mock API Functions ───────────────────────────────────────────────────────

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// פונקציה חדשה לקבלת רשימת המערכות
export async function listSystems(): Promise<SystemInfo[]> {
  await delay();
  return MOCK_SYSTEMS;
}

export async function getStats(): Promise<Stats> {
  await delay();
  const passed = MOCK_RUNS.filter((r) => r.status === "passed").length;
  const failed = MOCK_RUNS.filter((r) => r.status === "failed").length;
  const total = MOCK_RUNS.length;
  
  return {
    total_runs: total,
    passed,
    failed,
    pass_rate: total > 0 ? Math.round((passed / total) * 100) : 0,
  };
}

export async function listRuns(opts?: { limit?: number; simulation_name?: string; status?: string }): Promise<RunInfo[]> {
  await delay();
  let runs = [...MOCK_RUNS];
  if (opts?.simulation_name) runs = runs.filter((r) => r.simulation_name === opts.simulation_name);
  if (opts?.status) runs = runs.filter((r) => r.status === opts.status);
  if (opts?.limit) runs = runs.slice(0, opts.limit);
  return runs;
}

export async function getRun(id: string): Promise<RunInfo & { config_snapshot: Record<string, any> }> {
  await delay();
  const run = MOCK_RUNS.find((r) => r.id === id) ?? MOCK_RUNS[0];
  return { ...run, config_snapshot: MOCK_CONFIG };
}

export async function getRunEvents(id: string): Promise<RunEventInfo[]> {
  await delay();
  return MOCK_EVENTS;
}

export async function listScenarios(): Promise<ScenarioInfo[]> {
  await delay();
  return MOCK_SCENARIOS;
}

export async function createScenario(data: any): Promise<ScenarioInfo> {
  await delay(500);
  const newId = `sim-${Date.now()}`;
  const newSim: ScenarioInfo = { 
    id: data.simulation_config_id || newId,
    simulation_config_id: data.simulation_config_id || newId,
    name: data.scenario_name || data.name || "Untitled Simulation",
    scenario_name: data.scenario_name || data.name,
    description: data.description,
    scenario_config: data.scenario_config
  };
  
  const existingIdx = MOCK_SCENARIOS.findIndex(s => s.id === newSim.id);
  if (existingIdx !== -1) {
    MOCK_SCENARIOS[existingIdx] = newSim;
  } else {
    MOCK_SCENARIOS.push(newSim);
  }
  
  return newSim;
}

export async function deleteScenario(id: string): Promise<void> {
  await delay();
  const idx = MOCK_SCENARIOS.findIndex((s) => s.id === id);
  if (idx !== -1) MOCK_SCENARIOS.splice(idx, 1);
}

export async function runScenario(id: string): Promise<{ run_id: string }> {
  await delay(300);
  const runId = `run-live-${Date.now()}`;
  
  const scenario = MOCK_SCENARIOS.find(s => s.id === id || s.simulation_config_id === id);
  
  const newRun: RunInfo = {
    id: runId,
    simulation_name: scenario?.scenario_name || scenario?.name || "Unknown Simulation",
    status: "running",
    duration_seconds: 0,
    total_events: 0,
    error_count: 0,
    started_at: new Date().toISOString(),
    test_scenario_id: id,
  };
  
  MOCK_RUNS.unshift(newRun); 
  
  setTimeout(() => {
    const runIndex = MOCK_RUNS.findIndex(r => r.id === runId);
    if (runIndex !== -1) {
      MOCK_RUNS[runIndex] = {
        ...MOCK_RUNS[runIndex],
        status: "passed",
        duration_seconds: 3.2 + Math.random() * 2, 
        total_events: 150 + Math.floor(Math.random() * 100),
        error_count: 0,
      };
    }
  }, 3000);
  
  return { run_id: runId };
}

export async function generateScenario(profileId: string, template: string, name?: string): Promise<{ scenario: any }> {
  await delay(800);
  return {
    scenario: {
      name: name || `${template}_test`,
      description: `Auto-generated from template: ${template}`,
      transport_latency_ms: 0,
      transport_jitter_ms: 0,
      phases: [
        { name: "setup", phase_type: "setup", actions: [{ type: "start_participant", participant_ref: "Publisher_A", params: {} }] },
        { name: "test", phase_type: "test", actions: [{ type: "send_messages", participant_ref: "Publisher_A", params: { count: 10 } }] },
      ],
      assertions: [
        { type: "delivery_complete", scope: "all", params: {} },
        { type: "no_errors", scope: "all", params: {} },
      ],
    },
  };
}

export async function importYamlSimulation(yaml: string): Promise<ScenarioInfo> {
  await delay(500);
  return { id: `sim-yaml-${Date.now()}`, name: "Imported Simulation" };
}

export async function listProfiles(): Promise<ProfileInfo[]> {
  await delay();
  return MOCK_PROFILES;
}

export async function createProfile(name: string, xml: string): Promise<{ validation_warnings: any[] }> {
  await delay(500);
  MOCK_PROFILES.push({ id: `profile-${Date.now()}`, name, created_at: new Date().toISOString() });
  return { validation_warnings: [] };
}

export async function deleteProfile(id: string): Promise<void> {
  await delay();
  const idx = MOCK_PROFILES.findIndex((p) => p.id === id);
  if (idx !== -1) MOCK_PROFILES.splice(idx, 1);
}

export async function getProfileTopology(id: string): Promise<TopologyInfo> {
  await delay();
  return {
    domains: [{ name: "DefaultDomain", domain_id: 0 }],
    topics: [
      { name: "SensorData", type_ref: "SensorType" },
      { name: "CommandData", type_ref: "CmdType" },
    ],
    participants: [
      { name: "Publisher_A", domain_id: 0, writers: [{ name: "w1", topic: "SensorData" }], readers: [] },
      { name: "Subscriber_B", domain_id: 0, writers: [], readers: [{ name: "r1", topic: "SensorData" }] },
    ],
  };
}

export async function fetchProfileXml(id: string): Promise<{ xml: string }> {
  await delay();
  return { xml: `<?xml version="1.0" encoding="UTF-8"?>\n<dds>\n  \n  <domain_library name="DefaultLibrary">\n    <domain name="DefaultDomain" domain_id="0">\n      <topic name="SensorData" type_ref="SensorType"/>\n    </domain>\n  </domain_library>\n</dds>` };
}

export async function listTemplates(): Promise<TemplateInfo[]> {
  await delay();
  return [
    { name: "basic_pub_sub", description: "Basic publisher-subscriber test" },
    { name: "stress_test", description: "High-volume message stress test" },
    { name: "qos_validation", description: "QoS policy validation suite" },
    { name: "discovery_test", description: "Endpoint discovery test" },
  ];
}

export function connectRunWs(
  runId: string,
  onEvent: (event: Record<string, any>) => void,
  onComplete: (completion: any) => void,
  onError?: (err: any) => void,
  onInit?: (init: WsInitMessage) => void
): WebSocket {
  const fakeWs = { close: () => {} } as WebSocket;

  setTimeout(() => {
    onInit?.({ simulation_name: "Live Simulation Run", config: MOCK_CONFIG, status: "running" });
  }, 100);

  let i = 0;
  const interval = setInterval(() => {
    if (i < MOCK_EVENTS.length) {
      onEvent({ ...MOCK_EVENTS[i], id: `live-${i}` });
      i++;
    } else {
      clearInterval(interval);
      onComplete({
        status: "passed",
        duration_seconds: 3.21,
        errors: [],
        summary: { topic_stats: { SensorData: { sent: 100, received: 98, lost: 2, loss_percent: 2.0 } } },
        report: {
          assertion_results: [
            { assertion_type: "delivery_complete", passed: true, scope: "all", message: "98/100 messages delivered" },
            { assertion_type: "no_errors", passed: true, scope: "all", message: "No critical errors" },
          ],
          deployment_health: { Publisher_A: { initialized: true }, Subscriber_B: { initialized: true } },
          topic_stats: { SensorData: { sent: 100, received: 98, lost: 2, loss_percent: 2.0 } },
        },
        db_run_id: `run-live-${runId}`,
      });
    }
  }, 300);

  return fakeWs;
}