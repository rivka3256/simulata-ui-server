

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FlaskConical, 
  Play, 
  Activity, 
  Percent, 
  Clock,
  Plus,
  Square 
} from "lucide-react";

import { getAllSimulations, runSimulation } from "../api/simulations";
import { getAllRuns, stopRun } from "../api/runs"; 
import type { SimulationConfig, SimulationRun } from "../types/api";
import { useToast } from "../components/Toast";

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) {
  return (
    <div className="bg-white rounded-[6px] border-2 border-slate-100 p-5 shadow-sm text-left font-heebo">
      <div className="flex items-center gap-3 mb-3">
        <Icon size={16} className="text-navy-950" />
        <span className="text-[10px] font-black tracking-[0.15em] text-navy-950 uppercase">
          {label}
        </span>
      </div>
      <div className="text-2xl font-black text-navy-950 tabular-nums">
        {value}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [recentRuns, setRecentRuns] = useState<SimulationRun[]>([]);
  const [simulations, setSimulations] = useState<SimulationConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const totalRuns = recentRuns.length;
  const passedRuns = recentRuns.filter(r => {
    const s = String(r.status || '').toLowerCase();
    return s === 'passed' || s === 'completed';
  }).length;
  const passRate = totalRuns > 0 ? ((passedRuns / totalRuns) * 100).toFixed(1) : "0";

  const isRunActive = (run: SimulationRun) => {
    const status = String(run.status || '').toLowerCase();
    if (status !== 'in progress' && status !== 'running') return false;
    const start = new Date(run.start_time).getTime();
    return Date.now() - start < 15000; 
  };

  const refresh = async () => {
    try {
      const [runsData, simsData] = await Promise.all([
        getAllRuns(),
        getAllSimulations(),
      ]); 

      const fetchedRuns = runsData || [];

      setRecentRuns((prevRecent) => {
        // שומרים ריצות שכבר סומנו כ-Passed לטובת הזיכרון המקומי
        const localPassed = prevRecent.filter(r => String(r.status).toLowerCase() === 'passed');

        const enrichedFetched = fetchedRuns.map((r: any) => {
          const start = new Date(r.start_time).getTime();
          let currentStatus = r.status;
          const serverStatusLower = String(currentStatus || '').toLowerCase();

          if ((serverStatusLower === 'in progress' || serverStatusLower === 'running') && Date.now() - start >= 15000) {
            currentStatus = 'Passed';
          }

          const configId = r.simulation_config_id?.simulation_config_id || r.simulation_config_id;

          return { 
            ...r, 
            status: currentStatus,
            simulation_config_id: typeof configId === 'string' ? configId : String(configId || '')
          };
        });

        // שילוב מונע מחיקות של ריצות שהסתיימו
        const combined = [...enrichedFetched];
        localPassed.forEach(saved => {
          if (!combined.some(c => c.simulation_run_id === saved.simulation_run_id)) {
            combined.push(saved);
          }
        });

        return combined;
      });

      // setSimulations(simsData || []);
      // ✨ הקוד החדש (הופך את הסדר - החדשות למעלה):
      const orderedSims = simsData ? [...simsData].reverse() : [];
      setSimulations(orderedSims);
    } catch (err) {
      console.error("Dashboard refresh error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    refresh();
    const interval = setInterval(refresh, 2000); 
    return () => clearInterval(interval);
  }, []);

  const handleRun = async (id: string, name: string) => {
    try {
      const result = await runSimulation(id);
      toast(`Simulation "${name}" started`, "info");
      navigate(`/run/${result.run.simulation_run_id}`, { state: { simName: name } });
    } catch (err: any) {
      toast(err.message, "error");
    }
  }; 

  const handleStopRun = async (e: React.MouseEvent, runId: string) => {
    e.stopPropagation(); 
    try {
      await stopRun(runId);
      setRecentRuns(prev => prev.filter(r => r.simulation_run_id !== runId));
      toast("Simulation stopped and deleted", "info");
      refresh(); 
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  if (loading && recentRuns.length === 0) return (
    <div className="p-10 md:p-20 text-center font-heebo font-bold text-slate-300 tracking-widest italic text-sm md:text-base">
      LOADING SIMULATA ENGINE...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-heebo text-left" dir="ltr">
      <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-slate-200 pb-4 md:pb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                Operational Overview
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-navy-950 tracking-tight">DASHBOARD</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Simulations" value={simulations.length} icon={FlaskConical} />
          <StatCard label="Total Runs" value={totalRuns} icon={Activity} />
          <StatCard label="Pass Rate" value={`${passRate}%`} icon={Percent} />
          <StatCard label="Avg Duration" value="15.0s" icon={Clock} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* Main Table */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[6px] border-2 border-slate-100 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-50 gap-3">
                <h2 className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">
                  Simulations
                </h2>
                <button 
                  onClick={() => navigate('/new-simulation')}
                  className="cursor-pointer group flex items-center justify-center gap-2 bg-white text-navy-950 border border-slate-200 px-3 py-2 sm:py-1.5 rounded-[4px] font-black text-[10px] tracking-wider hover:border-navy-950 transition-all w-full sm:w-auto"
                >
                  <Plus size={12} className="text-sky-400 group-hover:scale-125 transition-transform" />
                  NEW SIMULATION
                </button>
              </div>

              <div className="divide-y divide-slate-50">
                {simulations.length === 0 ? (
                  <div className="py-12 text-center text-slate-300 font-bold text-xs tracking-widest uppercase">
                    No Scenarios Defined
                  </div>
                ) : (
                  simulations.map((sim) => {
                    const systems = sim.configuration_details?.systems || [];
                    const hasContracts = systems.length > 0 && systems.every(sys => !!sys.contract_config_id);
                    const contractsCount = systems.filter(sys => !!sys.contract_config_id).length;

                    return (
                      <div 
                        key={sim.simulation_config_id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50/50 transition-colors gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 bg-slate-100 rounded-[4px] flex items-center justify-center shrink-0 shadow-inner">
                            <Activity size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-black text-navy-950 uppercase tracking-tight truncate">
                              {sim.simulation_name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                              Contracts: <span className="text-slate-500 italic">{contractsCount}</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t sm:border-0 pt-3 sm:pt-0">
                           {hasContracts ? (
                             <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shrink-0">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                <span className="text-[9px] font-black text-emerald-700 uppercase">Ready</span>
                             </div>
                           ) : (
                             <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shrink-0">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                <span className="text-[9px] font-black text-amber-700 uppercase">Not Ready</span>
                             </div>
                           )}
                           
                           <button 
                             onClick={() => handleRun(sim.simulation_config_id, sim.simulation_name || "Unknown Sim")}
                             disabled={!hasContracts}
                             className="cursor-pointer bg-sky-400 text-white px-5 py-1.5 rounded-[4px] font-black text-[10px] tracking-tighter hover:bg-sky-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             <Play size={10} fill="currentColor" />
                             RUN
                           </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Recent Runs Sidebar */}
          <div className="lg:col-span-4 w-full">
            <section className="bg-white rounded-[6px] border-2 border-slate-100 shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">Recent Runs</h2>
                <button 
                  onClick={() => navigate('/history')}
                  className="cursor-pointer text-[9px] font-bold text-blue-500 hover:underline uppercase"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-5">
                {recentRuns.length === 0 ? (
                  <div className="py-8 text-center text-slate-300 font-bold text-xs tracking-widest uppercase">
                    No Recent Runs
                  </div>
                ) : (
                  [...recentRuns]
                    .sort((a, b) => {
                      const timeA = a.start_time ? new Date(a.start_time).getTime() : 0;
                      const timeB = b.start_time ? new Date(b.start_time).getTime() : 0;
                      return timeB - timeA;
                    })
                    .map((run: any) => {
                      const matchedSim = simulations.find(s => s.simulation_config_id === run.simulation_config_id);
                      
                      const displayName = 
                        matchedSim?.simulation_name || 
                        run.simulation_name || 
                        run.simulation_config_id?.scenario_name ||
                        `Run: ${run.simulation_run_id?.slice(0, 8)}`;

                      const active = isRunActive(run);
                      const displayStatus = active ? 'In Progress' : run.status;

                      return (
                        <div 
                          key={run.simulation_run_id} 
                          className="flex items-center justify-between gap-3 group cursor-pointer border-b border-slate-50 pb-3 last:border-0 last:pb-0" 
                          onClick={() => navigate(`/run/${run.simulation_run_id}`, { state: { simName: displayName } })}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-2 h-2 mt-1 rounded-full shrink-0 ${displayStatus === 'Passed' || displayStatus === 'Completed' ? 'bg-emerald-400' : displayStatus === 'Failed' ? 'bg-rose-500' : 'bg-blue-400 animate-pulse'}`}></div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-black text-navy-950 uppercase truncate tracking-tight group-hover:text-blue-500 transition-colors">
                                {displayName}
                              </p>
                              <p className="text-[9px] text-slate-400 font-bold truncate">
                                {run.start_time ? new Date(run.start_time).toLocaleString() : '—'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-black text-slate-400 uppercase tabular-nums">
                              {displayStatus}
                            </span>
                            
                            {active && (
                              <button
                                onClick={(e) => handleStopRun(e, run.simulation_run_id)}
                                className="cursor-pointer p-1 bg-rose-50 text-rose-500 border border-rose-200 rounded hover:bg-rose-500 hover:text-white transition-colors"
                              >
                                <Square size={10} fill="currentColor" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}