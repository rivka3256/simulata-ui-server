
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FlaskConical, 
  Play, 
  Activity, 
  Percent, 
  Clock,
  Plus
} from "lucide-react";
import { 
  getStats, 
  listRuns, 
  runScenario, 
  type RunInfo, 
  type Stats 
} from "../api/index";
import { useToast } from "../components/Toast";
import { getAllSimulations, type SimulationConfig } from "../api/index";

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
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRuns, setRecentRuns] = useState<RunInfo[]>([]);
  const [simulations, setSimulations] = useState<SimulationConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const [s, r, sims] = await Promise.all([
        getStats(),
        listRuns({ limit: 10 }),
        getAllSimulations(),
      ]); 
      setStats(s);
      setRecentRuns(r);
      setSimulations(sims);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRun = async (id: string, name: string) => {
    // עדכון: חיפוש לפי ה-ID החדש
    const scenario = simulations.find(s => s.simulation_config_id === id);
    
    // עדכון: בדיקה אם קיימים 'productions' (המבנה החדש במקום scenario_config)
    if (!scenario || !scenario.productions || scenario.productions.length === 0) {
      toast(`Cannot run "${name}": No productions configured.`, "error");
      return;
    }

    try {
      const result = await runScenario(id);
      toast(`Simulation "${name}" started`, "info");
      navigate(`/run/${result.run_id}`, { state: { simName: name } });
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  if (loading) return (
    <div className="p-20 text-center font-heebo font-bold text-slate-300 tracking-widest italic">
      LOADING SIMULATA ENGINE...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-heebo text-left" dir="ltr">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        <div className="flex items-end justify-between border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                Operational Overview
              </span>
            </div>
            <h1 className="text-3xl font-black text-navy-950 tracking-tight">DASHBOARD</h1>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Simulations" value={simulations.length} icon={FlaskConical} />
            <StatCard label="Total Runs" value={stats.total_runs} icon={Activity} />
            <StatCard label="Pass Rate" value={`${stats.pass_rate}%`} icon={Percent} />
            <StatCard label="Avg Duration" value="27.1s" icon={Clock} />
          </div>
        )}

        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-8">
            <div className="bg-white rounded-[6px] border-2 border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-50">
                <h2 className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">
                  Simulations
                </h2>
                <button 
                  onClick={() => navigate('/new-simulation')}
                  className="group flex items-center gap-2 bg-white text-navy-950 border border-slate-200 px-3 py-1.5 rounded-[4px] font-black text-[10px] tracking-wider hover:border-navy-950 transition-all"
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
                    // עדכון לוגיקת ה-Ready: בודקים אם יש חוזים (contracts) בתוך ה-productions
                    const hasActions = sim.productions?.some(
                      (p) => p.contracts && p.contracts.length > 0
                    ) || false;

                    return (
                      <div 
                        key={sim.simulation_config_id} 
                        className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-[4px] flex items-center justify-center group-hover:bg-sky-400 group-hover:text-white transition-all shadow-inner">
                            <Activity size={16} />
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-navy-950 uppercase tracking-tight">
                              {sim.scenario_name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                              Productions: <span className="text-slate-500 italic">
                                {sim.productions?.length || 0}
                              </span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                           {hasActions ? (
                             <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                <span className="text-[9px] font-black text-emerald-700 uppercase">Ready</span>
                             </div>
                           ) : (
                             <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                <span className="text-[9px] font-black text-amber-700 uppercase">Not Ready</span>
                             </div>
                           )}
                           
                           <button 
                             onClick={() => handleRun(sim.simulation_config_id, sim.scenario_name)}
                             disabled={!hasActions}
                             className="bg-sky-400 text-white px-5 py-1.5 rounded-[4px] font-black text-[10px] tracking-tighter hover:bg-sky-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="col-span-4 space-y-6">
            <section className="bg-white rounded-[6px] border-2 border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">Recent Runs</h2>
                <button 
                  onClick={() => navigate('/history')}
                  className="text-[9px] font-bold text-blue-500 hover:underline uppercase"
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
                  recentRuns.map((run) => (
                    <div key={run.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => navigate(`/run/${run.id}`)}>
                      <div className={`w-2 h-2 mt-1 rounded-full shrink-0 ${run.status === 'passed' ? 'bg-emerald-400' : 'bg-rose-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-navy-950 uppercase truncate tracking-tight group-hover:text-blue-500 transition-colors">
                          {run.simulation_name}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold">
                          {run.started_at ? new Date(run.started_at).toLocaleString() : '—'}
                        </p>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 tabular-nums">
                        {(run.duration_seconds || 0).toFixed(1)}s
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}