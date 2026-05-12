import { useNavigate } from "react-router-dom";
import type { RunInfo } from "../api";
import StatusBadge from "./StatusBadge";

const STATUS_STRIPE: Record<string, string> = {
  passed: "bg-emerald-500",
  failed: "bg-red-500",
  error: "bg-red-500",
  timeout: "bg-amber-500",
  running: "bg-blue-500",
};

export default function RunCard({ run }: { run: RunInfo }) {
  const navigate = useNavigate();
  const startedAt = run.started_at ? new Date(run.started_at).toLocaleString() : "—";

  return (
    <div
      onClick={() => navigate(`/run/${run.id}`)}
      className="flex items-stretch rounded-lg border border-gray-800 bg-gray-900/30 hover:bg-gray-900/60 cursor-pointer transition-colors overflow-hidden"
    >
      <div className={`w-1 shrink-0 ${STATUS_STRIPE[run.status] ?? "bg-gray-600"}`} />
      <div className="flex items-center gap-4 px-4 py-3 flex-1 min-w-0">
        <StatusBadge status={run.status} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-200 truncate">{run.simulation_name}</div>
          <div className="text-xs text-gray-500">{startedAt}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm tabular-nums text-gray-300">{(run.duration_seconds ?? 0).toFixed(2)}s</div>
          <div className="text-xs text-gray-500">
            {run.total_events} events
            {run.error_count > 0 && <span className="text-red-400 ml-1">{run.error_count} errors</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
