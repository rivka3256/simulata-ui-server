<<<<<<< HEAD
=======

>>>>>>> 891252009d79395bb2dab802b71edb5f0c7dac34
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
    <div className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-sm text-left">
      <div className="flex items-center gap-3 mb-3">
        <Icon size={16} className="text-[#141E52]" />
        <span className="text-[10px] font-black tracking-[0.15em] text-[#141E52] uppercase">
          {label}
        </span>
      </div>
      <div className="text-2xl font-black text-[#141E52] tabular-nums">
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

        const combined = [...enrichedFetched];
        localPassed.forEach(saved => {
          if (!combined.some(c => c.simulation_run_id === saved.simulation_run_id)) {
            combined.push(saved);
          }
        });

        return combined;
      });

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
    <div className="p-10 md:p-20 text-center font-bold text-slate-300 tracking-widest italic text-sm md:text-base">
      LOADING SIMULATA ENGINE...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-left" dir="ltr">
      <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-slate-200 pb-4 md:pb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-[#274D96] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                Operational Overview
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#141E52] tracking-tight">DASHBOARD</h1>
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
          
          {/* Main Simulations Box */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-slate-100 gap-3">
                <h2 className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">
                  Simulations
                </h2>
                <button 
                  onClick={() => navigate('/new-simulation')}
                  className="cursor-pointer group flex items-center justify-center gap-2 bg-[#274D96] text-white px-4 py-2 rounded-lg font-medium text-xs transition-all hover:bg-[#37A8D8] w-full sm:w-auto shadow-sm"
                >
                  <Plus size={14} className="transition-transform group-hover:scale-110" />
                  New Simulation
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {simulations.length === 0 ? (
                  <div className="py-12 text-center text-slate-300 font-bold text-xs tracking-widest uppercase">
                    No Simulations Defined
                  </div>
                ) : (
                  simulations.map((sim) => {
                  //   const systems = sim.configuration_details?.systems || [];
                  //  const hasContracts = systems.length > 0 && systems.every(sys => !!sys.contract);
                  //   const contractsCount = systems.filter(sys => !!sys.contract).length;
                  // const systems = sim.configuration_details?.systems || [];
                  // const hasContracts = systems.length > 0 && systems.every(sys => !!sys.contract.length);
                  // const contractsCount = systems.reduce((acc, sys) => acc + sys.contract.length, 0);
                  const systems = sim.systems || [];
                  
                  // בודק אם לכל המערכות יש מערך חוזים והוא לא ריק
                  const hasContracts = systems.length > 0 && systems.every(sys => (sys.contracts?.length || 0) > 0);
                  
                  // סופר כמה חוזים (מילונים) יש בסך הכל על פני כל המערכות
                  const contractsCount = systems.reduce((acc, sys) => acc + (sys.contracts?.length || 0), 0);
                  return (
                      <div 
                        key={sim.simulation_config_id} 
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50/70 hover:shadow-lg hover:shadow-[#37A8D8]/5 hover:-translate-y-0.5 transition-all duration-300 gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* אייקון ה-Activity שמחליף צבע לתכלת הרשמי בריחוף */}
                          <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-[#37A8D8] group-hover:text-white transition-all duration-300 transform group-hover:scale-105">
                            <Activity size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold text-[#141E52] uppercase tracking-tight truncate group-hover:text-[#274D96] transition-colors">
                              {sim.simulation_name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                              Contracts: <span className="text-slate-500 italic">{contractsCount}</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t sm:border-0 pt-3 sm:pt-0">
                           {hasContracts ? (
                             <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shrink-0">
                                <div className="w-1.5 h-1.5 bg-[#59660F] rounded-full"></div>
                                <span className="text-[9px] font-black text-[#59660F] uppercase">Ready</span>
                             </div>
                           ) : (
                             <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shrink-0">
                                <div className="w-1.5 h-1.5 bg-[#D65527] rounded-full"></div>
                                <span className="text-[9px] font-black text-[#D65527] uppercase">Not Ready</span>
                             </div>
                           )}
                           
                           <button 
                             onClick={() => handleRun(sim.simulation_config_id, sim.simulation_name || "Unknown Sim")}
                             disabled={!hasContracts}
                             className="cursor-pointer bg-[#274D96] text-white px-5 py-2 rounded-lg font-medium text-xs tracking-wide hover:bg-[#37A8D8] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                           >
                             <Play size={11} fill="currentColor" />
                             Run
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
            <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">Recent Runs</h2>
                <button 
                  onClick={() => navigate('/history')}
                  className="cursor-pointer text-[10px] font-bold text-[#274D96] hover:text-[#37A8D8] transition-colors uppercase tracking-wider"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
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
                    .slice(0, 7) // מציגים את ה-7 האחרונים למראה נקי
                    .map((run: any) => {
                      const matchedSim = simulations.find(s => s.simulation_config_id === run.simulation_config_id);
                      
                      const displayName = 
                        matchedSim?.simulation_name || 
                        run.simulation_name || 
                        run.simulation_config_id?.scenario_name ||
                        `Run: ${run.simulation_run_id?.slice(0, 8)}`;

                      const active = isRunActive(run);
                      const displayStatus = active ? 'In Progress' : run.status;

                      // קביעת צבע הנקודה לפי הצבעים הרשמיים
                      let dotColor = "bg-[#274D96] animate-pulse";
                      if (displayStatus === 'Passed' || displayStatus === 'Completed') dotColor = "bg-[#59660F]";
                      else if (displayStatus === 'Failed') dotColor = "bg-[#D65527]";

                      return (
                        <div 
                          key={run.simulation_run_id} 
                          className="flex items-center justify-between gap-3 group cursor-pointer border-b border-slate-50 pb-3 last:border-0 last:pb-0 hover:bg-slate-50/50 p-2 rounded-xl transition-all duration-200 hover:shadow-sm" 
                          onClick={() => navigate(`/run/${run.simulation_run_id}`, { state: { simName: displayName } })}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${dotColor}`}></div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-bold text-[#141E52] uppercase truncate tracking-tight group-hover:text-[#274D96] transition-colors">
                                {displayName}
                              </p>
                              <p className="text-[9px] text-slate-400 font-bold truncate mt-0.5">
                                {run.start_time ? new Date(run.start_time).toLocaleString() : '—'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-black uppercase tabular-nums ${active ? 'text-[#274D96]' : 'text-slate-400'}`}>
                              {displayStatus}
                            </span>
                            
                            {active && (
                              <button
                                onClick={(e) => handleStopRun(e, run.simulation_run_id)}
                                className="cursor-pointer p-1 bg-rose-50 text-[#D65527] border border-rose-100 rounded hover:bg-[#D65527] hover:text-white transition-colors"
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
