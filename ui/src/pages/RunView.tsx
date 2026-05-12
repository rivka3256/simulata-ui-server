import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, RotateCcw } from "lucide-react";
import { connectRunWs, getRun, getRunEvents, runScenario, type WsInitMessage, type RunReport } from "../api/index";
import { useToast } from "../components/Toast";
import StatusBadge from "../components/StatusBadge";
import TopicStats from "../components/TopicStats";
import EventLog from "../components/EventLog";
import SimulationGraph, { buildLiveStats } from "../components/SimulationGraph";

export default function RunView() {
  const { runId } = useParams<{ runId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [status, setStatus] = useState<string>("running");
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, any>[]>([]);
  const [topicStats, setTopicStats] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [simName, setSimName] = useState<string>((location.state as any)?.simName ?? "");
  const [config, setConfig] = useState<Record<string, any> | null>(null);
  const [logExpanded, setLogExpanded] = useState(false);
  const [report, setReport] = useState<RunReport | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(Date.now());
  const isCompleteRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => {
    if (status !== "running" && status !== "pending") { isCompleteRef.current = true; clearTimer(); }
  }, [status, clearTimer]);

  useEffect(() => {
    if (!runId) return;

    const loadFromDb = async () => {
      try {
        const run = await getRun(runId);
        setSimName(run.simulation_name);
        setStatus(run.status);
        setDuration(run.duration_seconds);
        if (run.test_scenario_id) setScenarioId(run.test_scenario_id);
        setErrors(run.errors ?? []);
        if (run.config_snapshot) setConfig(run.config_snapshot);
        if (run.report) {
          setReport(run.report);
          if (run.report.topic_stats && Object.keys(run.report.topic_stats).length > 0) setTopicStats(run.report.topic_stats);
        }
        if (run.message_summary && Object.keys(run.message_summary).length > 0) setTopicStats(run.message_summary);
        if (run.status !== "running") { isCompleteRef.current = true; const evts = await getRunEvents(runId); setEvents(evts); return true; }
        return false;
      } catch { return false; }
    };

    const connect = () => {
      const ws = connectRunWs(
        runId,
        (event) => setEvents((prev) => { const next = [...prev, event]; return next.length > 2000 ? next.slice(-2000) : next; }),
        (completion) => {
          isCompleteRef.current = true;
          setStatus(completion.status);
          if (completion.duration_seconds != null) setDuration(completion.duration_seconds);
          setErrors(completion.errors ?? []);
          if (completion.summary?.topic_stats) setTopicStats(completion.summary.topic_stats);
          if (completion.report) { setReport(completion.report); if (completion.report.topic_stats && Object.keys(completion.report.topic_stats).length > 0) setTopicStats(completion.report.topic_stats); }
          clearTimer();
        },
        undefined,
        (init: WsInitMessage) => {
          setSimName(init.simulation_name);
          if (init.config) setConfig(init.config);
          if (init.status !== "running") isCompleteRef.current = true;
        }
      );
      wsRef.current = ws;
    };

    loadFromDb().then((loaded) => {
      if (!loaded) {
        connect();
        timerRef.current = setInterval(() => {
          if (!isCompleteRef.current) setDuration((Date.now() - startTime.current) / 1000);
        }, 100);
      }
    });

    return () => { wsRef.current?.close(); clearTimer(); };
  }, [runId, clearTimer]);

  const isComplete = status !== "running" && status !== "pending";
  const liveStats = buildLiveStats(events);

  const handleRunAgain = async () => {
    if (!scenarioId) return;
    try { const result = await runScenario(scenarioId); toast("Re-running simulation", "info"); navigate(`/run/${result.run_id}`, { replace: true }); }
    catch (e: any) { toast(`Failed to re-run: ${e.message}`, "error"); }
  };

  const handleStop = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    clearTimer();
    setStatus("stopped");
    isCompleteRef.current = true;
    toast("Simulation stopped", "info");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-gray-800 bg-gray-900/30">
        <div className="flex items-center gap-4">
          <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate("/history"); }} className="text-gray-500 hover:text-gray-300">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">{simName || "Simulation Run"}</h1>
              <StatusBadge status={status} size="lg" />
              {!isComplete && (
                <button onClick={handleStop} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded-lg text-xs font-medium transition-colors ml-auto">
                  <XCircle size={13} />Stop
                </button>
              )}
              {isComplete && scenarioId && (
                <button onClick={handleRunAgain} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 rounded-lg text-xs font-medium transition-colors ml-auto">
                  <RotateCcw size={13} />Run Again
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Clock size={14} />{(duration ?? 0).toFixed(2)}s</span>
              <span>{events.length} events</span>
              {errors.length > 0 && <span className="text-red-400">{errors.length} errors</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className={`${logExpanded ? "h-1/2" : "flex-1"} border-b border-gray-800 p-4 overflow-auto`}>
            {config ? (
              <SimulationGraph config={config} liveStats={liveStats} isRunning={!isComplete} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600">Waiting for simulation config...</div>
            )}
          </div>
          <div className={`${logExpanded ? "h-1/2" : "h-10"} flex flex-col transition-all`}>
            <button onClick={() => setLogExpanded(!logExpanded)} className="shrink-0 flex items-center gap-2 px-4 py-2 text-xs text-gray-500 uppercase tracking-wider bg-gray-900/20 border-b border-gray-800 hover:bg-gray-900/40 w-full text-left">
              {logExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              Event Log ({events.length})
            </button>
            {logExpanded && <div className="flex-1 overflow-hidden"><EventLog events={events} autoScroll={!isComplete} /></div>}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-80 shrink-0 overflow-y-auto p-4 space-y-4 border-l border-gray-800">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Live Counters</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-950/30 rounded-lg p-3 border border-blue-900/30">
                <div className="text-2xl font-bold text-blue-400 tabular-nums">{Object.values(liveStats.sent).reduce((a, b) => a + b, 0)}</div>
                <div className="text-xs text-blue-500">Messages Sent</div>
              </div>
              <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-900/30">
                <div className="text-2xl font-bold text-emerald-400 tabular-nums">{Object.values(liveStats.received).reduce((a, b) => a + b, 0)}</div>
                <div className="text-xs text-emerald-500">Received</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Message Statistics</h3>
            {Object.keys(topicStats).length > 0 ? <TopicStats stats={topicStats} /> : <p className="text-xs text-gray-600">{isComplete ? "No topic data available" : "Waiting for completion..."}</p>}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">QoS Events</h3>
            {(() => {
              const matchedCount = events.filter((e) => e.category === "subscription_matched" || e.category === "publication_matched").length;
              const incompatCount = events.filter((e) => e.category === "incompatible_qos_offered" || e.category === "incompatible_qos_requested").length;
              return (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-emerald-400">Matched</span><span className="tabular-nums">{matchedCount}</span></div>
                  <div className="flex justify-between"><span className={incompatCount > 0 ? "text-red-400" : "text-gray-500"}>Incompatible</span><span className="tabular-nums">{incompatCount}</span></div>
                </div>
              );
            })()}
          </div>

          {report && report.assertion_results.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Assertion Results</h3>
              <div className="space-y-2">
                {report.assertion_results.map((r, i) => (
                  <div key={i} className={`rounded-lg p-3 border text-xs ${r.passed ? "bg-emerald-950/20 border-emerald-900/30" : "bg-red-950/20 border-red-900/30"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {r.passed ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> : <XCircle size={14} className="text-red-400 shrink-0" />}
                      <span className={`font-medium ${r.passed ? "text-emerald-300" : "text-red-300"}`}>{r.assertion_type.replace(/_/g, " ")}</span>
                    </div>
                    {r.scope && <div className="text-gray-500 ml-5 mb-1">Scope: {r.scope}</div>}
                    <div className={`ml-5 ${r.passed ? "text-emerald-400/70" : "text-red-400/70"}`}>{r.message}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                {report.assertion_results.every((r) => r.passed) ? (
                  <><CheckCircle2 size={14} className="text-emerald-400" /><span className="text-emerald-400">All assertions passed</span></>
                ) : (
                  <><AlertCircle size={14} className="text-red-400" /><span className="text-red-400">{report.assertion_results.filter((r) => !r.passed).length} of {report.assertion_results.length} failed</span></>
                )}
              </div>
            </div>
          )}

          {report && Object.keys(report.deployment_health).length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Deployment Health</h3>
              <div className="space-y-1">
                {Object.entries(report.deployment_health).map(([name, h]) => (
                  <div key={name} className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">{name}</span>
                    {h.initialized ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Ready</span> : <span className="text-red-400 flex items-center gap-1"><XCircle size={12} /> Not initialized</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-red-400 mb-2">Errors ({errors.length})</h3>
              <div className="space-y-1">
                {errors.map((err, i) => <div key={i} className="text-xs text-red-300 bg-red-950/20 rounded p-2 border border-red-900/30">{err}</div>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
