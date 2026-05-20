export enum RunStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  RUNNING = 'running',
}

// Normalize legacy/unknown statuses to the 3 valid ones
export function normalizeStatus(raw: string): RunStatus {
  if (raw === RunStatus.PASSED) return RunStatus.PASSED;
  if (raw === RunStatus.RUNNING || raw === 'pending' || raw === 'queued') return RunStatus.RUNNING;
  // failed, error, timeout, stopped, unknown → failed
  return RunStatus.FAILED;
}
