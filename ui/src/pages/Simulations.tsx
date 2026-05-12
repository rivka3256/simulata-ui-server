

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Plus, Play, Trash2, Upload, Activity, Database, Search } from 'lucide-react';

// // אימפורטים מה-API המקורי שלך
// import { 
//   listScenarios, 
//   listProfiles, 
//   deleteScenario, 
//   runScenario, 
//   importYamlSimulation, 
//   type ScenarioInfo, 
//   type ProfileInfo 
// } from "../api/index";

// const Simulations: React.FC = () => {
//   const navigate = useNavigate();
//   const yamlInputRef = useRef<HTMLInputElement>(null);
  
//   // States מהפרויקט הישן והחדש משולבים
//   const [simulations, setSimulations] = useState<ScenarioInfo[]>([]);
//   const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [importing, setImporting] = useState(false);

//   // פונקציית טעינה בדיוק כמו בישן
//   const loadData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [sims, pros] = await Promise.all([
//         listScenarios(),
//         listProfiles()
//       ]);
//       setSimulations(sims);
//       setProfiles(pros);
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   // לוגיקת ייבוא קובץ מהפרויקט הישן
//   const handleYamlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImporting(true);
//     try {
//       const yamlContent = await file.text();
//       await importYamlSimulation(yamlContent);
//       alert(`הקובץ "${file.name}" יובא בהצלחה!`);
//       await loadData(); // רענון רשימה
//     } catch (err: any) {
//       alert(`ייבוא נכשל: ${err.message}`);
//     } finally {
//       setImporting(false);
//       if (yamlInputRef.current) yamlInputRef.current.value = "";
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (window.confirm("האם את בטוחה שברצונך למחוק את הסימולציה?")) {
//       try {
//         await deleteScenario(id);
//         await loadData();
//       } catch (error) {
//         alert("שגיאה במחיקת הסימולציה");
//       }
//     }
//   };

//   const handleRun = async (id: string, scenarioName: string) => {
//     // בדיקה שיש Actions בסימולציה לפני הרצה
//     const scenario = simulations.find(s => s.id === id || s.simulation_config_id === id);
    
//     if (!scenario || !scenario.scenario_config || !scenario.scenario_config.phases) {
//       alert(`Cannot run "${scenarioName}": No execution plan defined.`);
//       return;
//     }

//     // בדיקה שיש לפחות action אחד
//     const hasActions = scenario.scenario_config.phases.some(
//       (p: any) => p.actions && p.actions.length > 0
//     );

//     if (!hasActions) {
//       alert(`Cannot run "${scenarioName}": No actions configured. Please edit the simulation and add at least one Data Reader or Data Writer.`);
//       return;
//     }

//     try {
//       const result = await runScenario(id);
//       navigate(`/run/${result.run_id}`);
//     } catch (error: any) {
//       alert(`Failed to run simulation: ${error.message}`);
//     }
//   };

//   const filteredSims = simulations.filter(s => 
//     s.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <div className="p-8 text-center font-['Heebo']">טוען סימולציות...</div>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto font-['Heebo']">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-[32px] font-bold text-slate-800 leading-tight">Simulations</h1>
//           <p className="text-[16px] font-normal text-slate-500">Managing and running simulation scenarios</p>
//         </div>
        
//         <div className="flex gap-3">
//           <input 
//             ref={yamlInputRef}
//             type="file" 
//             className="hidden" 
//             accept=".yaml,.yml"
//             onChange={handleYamlImport}
//           />
          
//           <button 
//             onClick={() => yamlInputRef.current?.click()}
//             disabled={importing}
//             className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[16px] font-normal"
//           >
//             <Upload size={18} />
//             {importing ? "Importing..." : "Import YAML"}
//           </button>

//           <button 
//             onClick={() => navigate('/new-simulation')}
//             className="flex items-center gap-2 px-4 py-2 bg-[#0a153f] text-white rounded-lg hover:bg-[#37A8D8] transition-colors text-[16px] font-medium"
//           >
//             <Plus size={18} />
//             New Simulation
//           </button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative mb-6">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//         <input 
//           type="text"
//           placeholder="Search simulation..."
//           className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A8D8]/20 text-[16px]"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Grid של כרטיסי סימולציה */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredSims.map((s) => {
//           const profile = profiles.find(p => p.id === s.dds_profile_id);
          
//           // בדיקה האם יש לפחות פעולה אחת (Action) מוגדרת בתוך השלבים
//           const hasActions = s.scenario_config?.phases?.some(
//             (p: any) => p.actions && p.actions.length > 0
//           ) || false;

//           return (
//             <div 
//               key={s.id} 
//               // שינוי 1: הפיכת הכרטיס ללחיץ למעבר לעריכה
//               onClick={() => navigate(`/edit-simulation/${s.simulation_config_id || s.id}`)}
//               className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <div className="p-3 bg-[#f0eeff] rounded-xl text-[#5c4cf4]">
//                   <Activity size={24} />
//                 </div>
//                 {/* שינוי 2: הוספת stopPropagation למנוע מעבר דף כשרוצים רק למחוק */}
//                 <button 
//                   onClick={(e) => {
//                     e.stopPropagation(); 
//                     handleDelete(s.id);
//                   }} 
//                   className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>

//               <h3 className="text-[24px] font-medium text-slate-800 mb-1 leading-snug">{s.name}</h3>
//               <p className="text-[16px] font-normal text-slate-500 mb-4 line-clamp-2">{s.description || 'אין תיאור זמין'}</p>

//               <div className="flex items-center gap-2 mb-6">
//                 <Database size={16} className="text-[#37A8D8]" />
//                 <span className="text-[16px] font-medium text-slate-600">Profile:</span>
//                 <span className="text-[14px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-normal">
//                   {profile?.name || 'System Default'}
//                 </span>
//               </div>

//               {/* Phases & Assertions */}
//               <div className="grid grid-cols-2 gap-4 mb-6 border-y border-slate-50 py-4">
//                 <div className="text-center">
//                   <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Phases</p>
//                   <p className="text-[20px] font-medium text-slate-700">
//                     {s.scenario_config?.phases?.length || 0}
//                   </p>
//                 </div>
//                 <div className="text-center border-l border-slate-100">
//                   <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Actions</p>
//                   <p className="text-[20px] font-medium text-slate-700">
//                     {s.scenario_config?.phases?.reduce((sum: number, p: any) => sum + (p.actions?.length || 0), 0) || 0}
//                   </p>
//                 </div>
//               </div>

//               {/* שינוי 3: תיקון כפתור ה-Run */}
//               {/* א. הוספת stopPropagation כדי שהקליק על הרצה לא יפתח בטעות את עריכת הדף */}
//               {/* ב. שינוי ה-disabled: כעת הכפתור יהיה זמין רק אם יש Actions בסימולציה */}
//               {!hasActions && (
//                 <div className="mb-3 text-center text-xs text-amber-600 bg-amber-50 py-2 rounded border border-amber-200">
//                   ⚠️ No actions configured - Edit to add actions before running
//                 </div>
//               )}
//           <button 
//             onClick={(e) => {
//               e.stopPropagation(); 
//               handleRun(s.simulation_config_id || s.id, s.scenario_name || s.name);
//             }}
//             disabled={!hasActions} // מאפשר להריץ רק אם יש Actions מוגדרים
//             className="w-full flex items-center justify-center gap-2 bg-[#37A8D8] text-white py-3 rounded-lg hover:bg-[#2e8db6] disabled:opacity-50 font-medium text-[16px] transition-colors"
//             title={!hasActions ? "Add actions to this simulation before running" : "Run this simulation"}
//           >
//             <Play size={18} fill="currentColor" />
//             Run
//           </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Simulations;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Trash2, Upload, Activity, Database, Search } from 'lucide-react';

// עדכון האימפורטים לשימוש ב-API החדש
import { 
  getAllSimulations, // הפונקציה החדשה
  listProfiles, 
  deleteScenario, 
  runScenario, 
  importYamlSimulation, 
  type SimulationConfig, // הטיפוס החדש
  type ProfileInfo 
} from "../api/index";

const Simulations: React.FC = () => {
  const navigate = useNavigate();
  const yamlInputRef = useRef<HTMLInputElement>(null);
  
  // עדכון ה-State לטיפוס החדש
  const [simulations, setSimulations] = useState<SimulationConfig[]>([]);
  const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [importing, setImporting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sims, pros] = await Promise.all([
        getAllSimulations(), // קריאה לשרת האמיתי
        listProfiles()
      ]);
      setSimulations(sims);
      setProfiles(pros);
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
      const yamlContent = await file.text();
      await importYamlSimulation(yamlContent);
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
    if (window.confirm("האם את בטוחה שברצונך למחוק את הסימולציה?")) {
      try {
        await deleteScenario(id);
        await loadData();
      } catch (error) {
        alert("שגיאה במחיקת הסימולציה");
      }
    }
  };

  const handleRun = async (id: string, scenarioName: string) => {
    const scenario = simulations.find(s => s.simulation_config_id === id);
    
    // בדיקה לפי המבנה החדש (productions במקום scenario_config)
    if (!scenario || !scenario.productions || scenario.productions.length === 0) {
      alert(`Cannot run "${scenarioName}": No configurations defined.`);
      return;
    }

    try {
      const result = await runScenario(id);
      navigate(`/run/${result.run_id}`);
    } catch (error: any) {
      alert(`Failed to run simulation: ${error.message}`);
    }
  };

  // חיפוש לפי scenario_name
  const filteredSims = simulations.filter(s => 
    (s.scenario_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center font-['Heebo']">טוען סימולציות...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-['Heebo']">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-slate-800 leading-tight">Simulations</h1>
          <p className="text-[16px] font-normal text-slate-500">Managing and running simulation scenarios</p>
        </div>
        
        <div className="flex gap-3">
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
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[16px] font-normal"
          >
            <Upload size={18} />
            {importing ? "Importing..." : "Import YAML"}
          </button>

          <button 
            onClick={() => navigate('/new-simulation')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0a153f] text-white rounded-lg hover:bg-[#37A8D8] transition-colors text-[16px] font-medium"
          >
            <Plus size={18} />
            New Simulation
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Search simulation..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A8D8]/20 text-[16px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSims.map((s) => {
          // בדיקה אם יש חוזים בתוך ה-productions (המבנה החדש)
          const hasActions = s.productions?.some(
            (p: any) => p.contracts && p.contracts.length > 0
          ) || false;

          return (
            <div 
              key={s.simulation_config_id} 
              onClick={() => navigate(`/edit-simulation/${s.simulation_config_id}`)}
              className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#f0eeff] rounded-xl text-[#5c4cf4]">
                  <Activity size={24} />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleDelete(s.simulation_config_id);
                  }} 
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="text-[24px] font-medium text-slate-800 mb-1 leading-snug">
                {s.scenario_name}
              </h3>
              <p className="text-[16px] font-normal text-slate-500 mb-4 line-clamp-2">
                Created at: {new Date(s.created_at).toLocaleDateString()}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <Database size={16} className="text-[#37A8D8]" />
                <span className="text-[16px] font-medium text-slate-600">ID:</span>
                <span className="text-[14px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-normal truncate max-w-[150px]">
                  {s.simulation_config_id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 border-y border-slate-50 py-4">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Productions</p>
                  <p className="text-[20px] font-medium text-slate-700">
                    {s.productions?.length || 0}
                  </p>
                </div>
                <div className="text-center border-l border-slate-100">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Total Contracts</p>
                  <p className="text-[20px] font-medium text-slate-700">
                    {s.productions?.reduce((sum: number, p: any) => sum + (p.contracts?.length || 0), 0) || 0}
                  </p>
                </div>
              </div>

              {!hasActions && (
                <div className="mb-3 text-center text-xs text-amber-600 bg-amber-50 py-2 rounded border border-amber-200">
                  ⚠️ No contracts configured
                </div>
              )}

              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleRun(s.simulation_config_id, s.scenario_name);
                }}
                disabled={!hasActions}
                className="w-full flex items-center justify-center gap-2 bg-[#37A8D8] text-white py-3 rounded-lg hover:bg-[#2e8db6] disabled:opacity-50 font-medium text-[16px] transition-colors"
              >
                <Play size={18} fill="currentColor" />
                Run
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Simulations;