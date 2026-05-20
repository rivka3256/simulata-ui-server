import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, ChevronDown, ChevronUp, RotateCcw, XCircle } from "lucide-react";
import { getRunById, stopRun } from "../api/runs";
import { runSimulation, getSimulationById } from "../api/simulations"; 

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

  const [status, setStatus] = useState<string>("In Progress");
  const [configId, setConfigId] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, any>[]>([]);
  const [topicStats, setTopicStats] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(0);
  
  const [simName, setSimName] = useState<string>(() => {
    const state = location.state as any;
    return state?.simName || state?.simulation_name || "Simulation Run";
  });
  
  const [config, setConfig] = useState<Record<string, any> | null>(null);
  const [logExpanded, setLogExpanded] = useState(false);
  const [report, setReport] = useState<any | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef<number>(Date.now());
  const isCompleteRef = useRef(false);
  const hasLoadedConfigRef = useRef(false);

  const currentStatusClean = (status || "").toLowerCase();
  const isComplete = currentStatusClean !== "in progress" && currentStatusClean !== "running" && currentStatusClean !== "pending";

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const clearPolling = useCallback(() => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
  }, []);

  useEffect(() => {
    const currentStatusClean = (status || "").toLowerCase();
    const isRunFinished = currentStatusClean !== "in progress" && 
                          currentStatusClean !== "running" && 
                          currentStatusClean !== "pending";

    if (isRunFinished) {
      isCompleteRef.current = true;
      clearTimer();
      clearPolling();
    }
  }, [status, clearTimer, clearPolling]);

  useEffect(() => {
    if (!runId) return;

    isCompleteRef.current = false;
    hasLoadedConfigRef.current = false;
    let hasSetStartTime = false;

    const updateDataFromDb = async () => {
      try {
        const run = (await getRunById(runId)) as any;
        if (!run) return false;

        const newStatus = run.status || "In Progress";
        setStatus(newStatus); 

        const checkStatusClean = newStatus.toLowerCase();
        const isRunFinished = checkStatusClean !== "in progress" && 
                             checkStatusClean !== "running" && 
                             checkStatusClean !== "pending";

        if (run.start_time && !hasSetStartTime) {
          startTime.current = new Date(run.start_time).getTime();
          hasSetStartTime = true;
        } else if (!run.start_time && !hasSetStartTime) {
          startTime.current = Date.now();
          hasSetStartTime = true;
        }

        if (isRunFinished) {
          setDuration(run.duration_seconds || 0);
          isCompleteRef.current = true;
          return true; 
        }
        
        if (run.simulation_name) {
          setSimName(run.simulation_name);
        }

        if (run.simulation_config_id) {
          setConfigId(run.simulation_config_id);
          if (!hasLoadedConfigRef.current) {
            hasLoadedConfigRef.current = true;
            try {
              // שימוש בפונקציה הנכונה מה-API של הסימולציות
              const simConfig = await getSimulationById(run.simulation_config_id); 
              setConfig(simConfig);
              if (simConfig?.simulation_name) {
                setSimName(simConfig.simulation_name);
              }
            } catch (err) {
              console.error("Failed to load simulation config:", err);
              hasLoadedConfigRef.current = false;
            }
          }
        }
        
        const extractedEvents = run.results?.events || run.events;
        if (extractedEvents && Array.isArray(extractedEvents)) {
          setEvents(extractedEvents);
        }
        
        if (run.results?.errors && run.results.errors > 0) {
          setErrors(new Array(run.results.errors).fill("Simulation error reported"));
        } else if (run.report?.errors) {
          setErrors(run.report.errors);
        }
        
        if (run.results?.topic_stats) {
          setTopicStats(run.results.topic_stats);
        } else if (run.report?.topic_stats) {
          setTopicStats(run.report.topic_stats);
        }

        if (run.report) {
          setReport(run.report);
        }
        
        return false;
      } catch (error) { 
        console.error("Failed to load run from DB:", error);
        return false; 
      }
    };

    updateDataFromDb().then((isFinished) => {
      if (!isFinished && !isCompleteRef.current) {
        pollingRef.current = setInterval(async () => {
          if (isCompleteRef.current) {
            clearPolling();
            return;
          }
          const finished = await updateDataFromDb();
          if (finished) clearPolling();
        }, 2000);

        timerRef.current = setInterval(() => {
          if (!isCompleteRef.current && hasSetStartTime) {
            const currentElapsed = (Date.now() - startTime.current) / 1000;
            
            if (currentElapsed >= 15) {
              isCompleteRef.current = true;
              setDuration(15);
              setStatus("Passed"); 
              clearTimer();
              clearPolling();
              if (runId) getRunById(runId).catch(() => {});
            } else {
              setDuration(Math.max(0, currentElapsed)); 
            }
          } else if (isCompleteRef.current) {
            clearTimer();
          }
        }, 100);
      }
    });

    return () => { 
      clearTimer(); 
      clearPolling();
    };
  }, [runId, clearTimer, clearPolling]);

  const liveStats = buildLiveStats(events);

  const handleRunAgain = async () => {
    if (!configId) return;
    try { 
      isCompleteRef.current = false;
      const result = await runSimulation(configId); 
      toast("Re-running simulation", "success"); 
      navigate(`/run/${result.run.simulation_run_id}`, { 
        replace: true,
        state: { simName: simName } 
      }); 
    }
    catch (e: any) { toast(`Failed to re-run: ${e.message}`, "error"); }
  };

  const handleStop = async () => {
    if (!runId) return;

    try {
      await stopRun(runId);
      clearTimer();
      clearPolling();
      isCompleteRef.current = true;
      setStatus("Failed"); 
      toast("Simulation stopped", "info");
    } catch (err: any) {
      clearTimer();
      clearPolling();
      isCompleteRef.current = true;
      setStatus("Failed");
      toast(`Stopped locally (Server error: ${err.message})`, "error");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-['Heebo']">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-800 bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          
          {/* כפתור חזור, שם הריצה, הסטטוס והזמן - כולם מתחילים משמאל */}
          <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate("/history"); }} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold tracking-tight">{simName}</h1>
          <div>
            <StatusBadge status={status} size="lg" />
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{events.length} events</span>
            <span className="flex items-center gap-1"><Clock size={14} />{(duration ?? 0).toFixed(2)}s</span>
            {errors.length > 0 && <span className="text-red-400 font-medium">{errors.length} errors</span>}
          </div>

          {/* הלחצן נדחף ימינה לסוף השורה בעזרת ml-auto */}
          <div className="ml-auto flex items-center gap-3">
            {!isComplete && (
              <button onClick={handleStop} className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold transition-colors text-white shadow-lg shadow-red-600/20">
                <XCircle size={13} />Stop
              </button>
            )}
            {isComplete && configId && (
              <button onClick={handleRunAgain} className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-bold transition-colors text-white shadow-lg shadow-sky-600/20">
                <RotateCcw size={13} />Run Again
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main content - סידור LTR רגיל: הגרף משמאל, הפאנל מימין */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* צד שמאל: הגרף המרכזי והלוגים */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/10">
          <div className={`${logExpanded ? "h-1/2" : "flex-1"} p-6 overflow-auto transition-all duration-300`}>
            {config ? (
              <SimulationGraph config={config} liveStats={liveStats} isRunning={!isComplete} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 animate-pulse">Waiting for simulation config...</div>
            )}
          </div>
          <div className={`${logExpanded ? "h-1/2" : "h-10"} flex flex-col transition-all duration-300 border-t border-slate-800 bg-slate-950`}>
            <button onClick={() => setLogExpanded(!logExpanded)} className="shrink-0 flex items-center gap-2 px-4 py-2.5 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-900/40 hover:bg-slate-900/70 w-full text-left transition-colors border-b border-slate-800">
              {logExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              Event Log ({events.length})
            </button>
            {logExpanded && <div className="flex-1 overflow-hidden"><EventLog events={events} autoScroll={!isComplete} /></div>}
          </div>
        </div>

        {/* צד ימין: פאנל הסטטיסטיקות הצידי */}
        <div className="w-80 shrink-0 overflow-y-auto p-4 space-y-4 border-l border-slate-800 bg-slate-900/20 backdrop-blur-md">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Live Counters</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-sky-950/20 rounded-xl p-3 border border-sky-500/10 shadow-sm">
                <div className="text-2xl font-black text-sky-400 tabular-nums">{Object.values(liveStats.sent).reduce((a, b) => a + b, 0)}</div>
                <div className="text-[11px] font-medium text-sky-500/80">Messages Sent</div>
              </div>
              <div className="bg-emerald-950/20 rounded-xl p-3 border border-emerald-500/10 shadow-sm">
                <div className="text-2xl font-black text-emerald-400 tabular-nums">{Object.values(liveStats.received).reduce((a, b) => a + b, 0)}</div>
                <div className="text-[11px] font-medium text-emerald-500/80">Received</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Message Statistics</h3>
            {Object.keys(topicStats).length > 0 ? <TopicStats stats={topicStats} /> : <p className="text-xs text-slate-500 bg-slate-900/40 rounded-lg p-3 border border-slate-800/60">{isComplete ? "No topic data available" : "Waiting for completion..."}</p>}
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">QoS Events</h3>
            {(() => {
              const matchedCount = events.filter((e) => e.category === "subscription_matched" || e.category === "publication_matched").length;
              const incompatCount = events.filter((e) => e.category === "incompatible_qos_offered" || e.category === "incompatible_qos_requested").length;
              return (
                <div className="space-y-1.5 text-xs bg-slate-900/30 rounded-xl p-3 border border-slate-800/60">
                  <div className="flex justify-between"><span className="text-emerald-400 font-medium">Matched Connections</span><span className="tabular-nums font-bold text-slate-300">{matchedCount}</span></div>
                  <div className="flex justify-between"><span className={incompatCount > 0 ? "text-rose-400 font-medium animate-pulse" : "text-slate-500 font-medium"}>Incompatible QoS</span><span className="tabular-nums font-bold text-slate-300">{incompatCount}</span></div>
                </div>
              );
            })()}
          </div>
        </div>

      </div>
    </div>
  );
}