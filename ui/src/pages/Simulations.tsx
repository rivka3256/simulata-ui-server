import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Trash2, Pencil, Upload, Activity, Database, Search } from 'lucide-react';

// שימוש בייבוא מהקבצים החדשים והמסודרים שלנו
import { getAllSimulations, deleteSimulation, runSimulation, importYamlSimulation } from "../api/simulations";
import type { SimulationConfig } from "../types/api";

const Simulations: React.FC = () => {
  const navigate = useNavigate();
  const yamlInputRef = useRef<HTMLInputElement>(null);
  
  const [simulations, setSimulations] = useState<SimulationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [importing, setImporting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllSimulations();
      setSimulations(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleYamlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      await importYamlSimulation(file);
      alert(`הקובץ "${file.name}" יובא בהצלחה!`);
      await loadData(); 
    } catch (err: any) {
      alert(`ייבוא נכשל: ${err.message}`);
    } finally {
      setImporting(false);
      if (yamlInputRef.current) yamlInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את הסימולציה?")) {
      try {
        await deleteSimulation(id);
        setSimulations(prev => prev.filter(s => s.simulation_config_id !== id));
      } catch (error) {
        alert("שגיאה במחיקת הסימולציה");
      }
    }
  };

  const handleRun = async (id: string, name: string) => {
    try {
      console.log(`Running simulation with ID: ${id}`);
      const result = await runSimulation(id);
      console.log("Run result:", result);
      if (result.run?.simulation_run_id) {
        console.log(`Navigating to run ID: ${result.run.simulation_run_id}`);
        navigate(`/run/${result.run.simulation_run_id}`, { state: { simName: name } });
      }
    } catch (error: any) {
      console.error("Error running simulation:", error);
      alert(`Failed to run simulation: ${error.message}`);
    }
  };

  const filteredSims = simulations.filter(s => 
    (s.simulation_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center font-['Heebo']">טוען סימולציות...</div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto font-['Heebo']" dir="ltr">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-[32px] font-bold text-slate-800 leading-tight">Simulations</h1>
          <p className="text-sm md:text-[16px] font-normal text-slate-500">Managing and running simulation scenarios</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <input 
            ref={yamlInputRef}
            type="file" 
            className="hidden" 
            accept=".yaml,.yml"
            onChange={handleYamlImport}
          />
          
          <button 
            onClick={() => yamlInputRef.current?.click()}
            disabled={importing}
            className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-xs md:text-sm lg:text-base font-normal bg-white whitespace-nowrap"
          >
            <Upload size={18} />
            {importing ? "Importing..." : "Import YAML"}
          </button>

          <button 
            onClick={() => navigate('/new-simulation')}
            className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0a153f] text-white rounded-lg hover:bg-[#37A8D8] transition-colors text-xs md:text-sm lg:text-base font-medium whitespace-nowrap"
          >
            <Plus size={18} />
            New Simulation
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Search simulation..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A8D8]/20 text-sm md:text-[16px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSims.map((s) => (
          <div 
            key={s.simulation_config_id} 
            className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-w-0"
          >
            <div>
              {/* Card Header Actions */}
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#f0eeff] rounded-xl text-[#5c4cf4] shrink-0">
                  <Activity size={24} />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleDelete(s.simulation_config_id);
                  }} 
                  className="cursor-pointer p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* טקסט השם מתקטן דינמית לפי גודל המסך כדי לא לברוח אף פעם */}
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-slate-800 mb-2 leading-snug break-words">
                {s.simulation_name}
              </h3>
              
              {/* טקסט ה-ID מתקטן דינמית ונשבר בצורה מאובטחת בתוך הבלוק שלו */}
              <p className="text-[10px] sm:text-xs md:text-sm font-normal text-slate-400 mb-4 break-all select-all bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="font-bold block text-slate-500 text-[9px] uppercase tracking-wider mb-0.5">Simulation ID</span>
                {s.simulation_config_id}
              </p>

              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-6 border-t border-slate-50 pt-4">
                <Database size={16} className="text-[#37A8D8] shrink-0" />
                <span className="text-xs sm:text-sm text-slate-600">Configuration active</span>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex gap-2 mt-auto">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  navigate(`/new-simulation/${s.simulation_config_id}`); 
                }}
                className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 font-medium text-xs sm:text-sm md:text-base transition-colors"
              >
                <Pencil size={15} />
                Edit
              </button>
              
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleRun(s.simulation_config_id, s.simulation_name); 
                }}
                className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 bg-[#37A8D8] text-white py-2.5 rounded-lg hover:bg-[#2e8db6] font-medium text-xs sm:text-sm md:text-base transition-colors"
              >
                <Play size={15} fill="currentColor" />
                Run
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSims.length === 0 && (
        <div className="text-center py-12 text-slate-400 font-medium text-sm uppercase tracking-wider">
          No matching simulations found
        </div>
      )}
    </div>
  );
};

export default Simulations;