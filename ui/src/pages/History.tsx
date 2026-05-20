

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, ArrowUpDown, Square } from "lucide-react";

import { getAllRuns, stopRun } from "../api/runs"; 
import { getAllSimulations } from "../api/simulations";
import type { SimulationRun, SimulationConfig } from "../types/api";
import { useToast } from "../components/Toast"; 

type SortKey = "simulation_name" | "status" | "start_time" | "end_time" | "errors";
type SortDir = "asc" | "desc";

export default function History() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [runs, setRuns] = useState<SimulationRun[]>([]);
  const [scenarios, setScenarios] = useState<SimulationConfig[]>([]);
  const [filterSim, setFilterSim] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("start_time");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const isRunActive = (run: SimulationRun) => {
    const status = String(run.status || '').toLowerCase();
    return status === 'in progress' || status === 'running';
  };

  const refresh = async () => {
    try {
      const [allRuns, allSims] = await Promise.all([
        getAllRuns(),
        getAllSimulations()
      ]);
      
      const enrichedRuns = (allRuns || []).map((run: any) => {
        const configId = run.simulation_config_id?.simulation_config_id || run.simulation_config_id;
        const targetConfigId = typeof configId === 'string' ? configId : String(configId || '');

        const scenario = (allSims || []).find(s => s.simulation_config_id === targetConfigId);
        const currentStatus = run.status || 'Passed'; 

        const resolvedName = 
          scenario?.simulation_name || 
          run.simulation_name || 
          run.simulation_config_id?.simulation_name ||
          "Unknown Sim";

        return {
          ...run,
          status: currentStatus,
          simulation_config_id: targetConfigId, 
          simulation_name: resolvedName
        };
      });

      setRuns(enrichedRuns);
      setScenarios(allSims || []);
    } catch (err) {
      console.error("Failed to load history data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStopRun = async (e: React.MouseEvent, runId: string) => {
    e.stopPropagation(); 
    try {
      await stopRun(runId);
      toast("Simulation stopped and removed from history", "info"); // 🌟 נמחק לגמרי כמו שרצית!
      refresh();
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  const filteredRuns = runs.filter(run => {
    const matchesSim = filterSim ? run.simulation_config_id === filterSim : true;
    const currentStatusLower = String(run.status || '').toLowerCase();
    const filterStatusLower = filterStatus.toLowerCase();
    
    const matchesStatus = filterStatus 
      ? (currentStatusLower === filterStatusLower || (filterStatusLower === 'passed' && currentStatusLower === 'completed'))
      : true;

    return matchesSim && matchesStatus;
  });

  const sortedRuns = [...filteredRuns].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    let av: any, bv: any;

    if (sortKey === "simulation_name") {
        av = a.simulation_name;
        bv = b.simulation_name;
    } else if (sortKey === "errors") {
        av = a.results?.errors ?? 0;
        bv = b.results?.errors ?? 0;
    } else {
        av = a[sortKey as keyof SimulationRun];
        bv = b[sortKey as keyof SimulationRun];
    }

    if (av == null) return dir;
    if (bv == null) return -dir;
    if (typeof av === "string") return av.localeCompare(bv) * dir;
    return (av - bv) * dir;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-6 py-4 cursor-pointer hover:bg-slate-100/50 transition-colors select-none font-heebo text-[10px] font-black tracking-widest text-slate-400 uppercase text-left whitespace-nowrap"
      onClick={() => toggleSort(field)}
    >
      <span className="flex items-center gap-1.5">
        {label}
        {sortKey === field && <ArrowUpDown size={11} className="text-navy-950" />}
      </span>
    </th>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-heebo text-left" dir="ltr">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-navy-950 tracking-tight uppercase">Run History</h1>
            <p className="text-[11px] text-slate-400 mt-1 font-bold">Review system execution logs</p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <button onClick={refresh} disabled={loading} className="cursor-pointer text-[10px] font-black text-blue-500 uppercase tracking-widest disabled:opacity-50">
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase bg-white border border-slate-200 px-4 py-2 rounded-[6px]">
              {sortedRuns.length} RUNS
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-4 rounded-[6px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter size={14} />
          </div>
          
          <select
            value={filterSim}
            onChange={(e) => setFilterSim(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-[6px] px-3 py-2 text-xs font-bold outline-none min-w-[200px]"
          >
            <option value="">All simulations</option>
            {scenarios.map((s) => (
              <option key={s.simulation_config_id} value={s.simulation_config_id}>{s.simulation_name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-[6px] px-3 py-2 text-xs font-bold outline-none min-w-[160px]"
          >
            <option value="">All statuses</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="bg-white rounded-[6px] py-32 text-center text-slate-300 font-bold text-xs uppercase tracking-widest">
            Loading...
          </div>
        ) : (
          <div className="bg-white rounded-[6px] border border-slate-100 shadow-sm overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <SortHeader label="Simulation" field="simulation_name" />
                  <SortHeader label="Status" field="status" />
                  <SortHeader label="Success Rate" field="status" />
                  <SortHeader label="Errors" field="errors" />
                  <SortHeader label="Started" field="start_time" />
                  <SortHeader label="Ended" field="end_time" />
                  <th className="px-6 py-4 font-heebo text-[10px] font-black tracking-widest text-slate-400 uppercase text-left whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedRuns.map((run) => {
                  const active = isRunActive(run);
                  
                  // צביעה חכמה לפי הסטטוס הרשמי מהשרת
                  let statusColor = "text-slate-700";
                  if (active) statusColor = "text-blue-500 font-black";
                  else if (run.status === "Passed") statusColor = "text-emerald-600 font-bold";
                  else if (run.status === "Failed") statusColor = "text-rose-600 font-bold";

                  return (
                    <tr
                      key={run.simulation_run_id}
                      onClick={() => navigate(`/run/${run.simulation_run_id}`, { state: { simName: run.simulation_name } })}
                      className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-navy-950 text-xs">
                        {run.simulation_name}
                      </td>
                      
                      <td className={`px-6 py-4 text-xs capitalize ${statusColor}`}>
                        {active ? 'In Progress' : run.status}
                      </td>
                      
                      <td className="px-6 py-4 tabular-nums text-xs text-black font-medium">
                        {run.results?.success_rate ?? "—"}%
                      </td>
                      
                      <td className={`px-6 py-4 tabular-nums text-xs font-bold ${(run.results?.errors ?? 0) > 0 ? 'text-rose-600' : 'text-black'}`}>
                        {run.results?.errors ?? 0}
                      </td>
                      
                      <td className="px-6 py-4 text-xs text-black font-medium whitespace-nowrap">
                        {run.start_time ? new Date(run.start_time).toLocaleString() : '—'}
                      </td>
                      
                      <td className="px-6 py-4 text-xs font-medium whitespace-nowrap text-slate-600">
                        {active ? (
                          <span className="text-blue-500 font-bold animate-pulse text-[11px]">Running...</span>
                        ) : run.end_time ? (
                          new Date(run.end_time).toLocaleString()
                        ) : (
                          '—'
                        )}
                      </td>
                      
                      <td className="px-6 py-4 text-xs whitespace-nowrap">
                        {active && (
                          <button
                            onClick={(e) => handleStopRun(e, run.simulation_run_id)}
                            className="cursor-pointer flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-[4px] font-black text-[9px] tracking-wide hover:bg-rose-600 hover:text-white transition-all uppercase"
                          >
                            <Square size={8} fill="currentColor" />
                            Stop
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}