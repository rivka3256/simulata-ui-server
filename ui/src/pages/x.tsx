/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // צבעי הצי והבסיס של המערכת - מותאמים לפיגמה של Simulata
        navy: {
          50: "#e3eaf8",
          100: "#b9caee",
          200: "#8da8e3",
          300: "#6186d8",
          400: "#426ccf",
          500: "#2353c6",
          600: "#1e4bbd",
          700: "#1640b0",
          800: "#0f36a3",
          900: "#002489",
          950: "#141E52", // הצבע הראשי של הפיגמה שלך! מעכשיו משתמשים ב-bg-navy-950 או text-navy-950
        },
        midnight: {
          50: "#e8eaf0",
          100: "#c5c9d9",
          200: "#9ea5bf",
          300: "#7780a5",
          400: "#596491",
          500: "#3b497d",
          600: "#354275",
          700: "#2d396a",
          800: "#263060",
          900: "#19204d",
          950: "#0d1225",
        },
        // הצבע הסגול מהפיגמה החדשה
        hydraPurple: '#9747FF', 
      },
      fontFamily: {
        // הגדרת פונט ברירת המחדל של הפרויקט לפי הפיגמה
        heebo: ['Heebo', 'sans-serif'],
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};




// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Plus, Trash2, Zap, MessageSquare } from 'lucide-react';
// import { listProfiles, createScenario } from "../api";

// const NewSimulation: React.FC = () => {
//   const navigate = useNavigate();
  
//   // States מותאמים למודלים החדשים
//   const [scenarioName, setScenarioName] = useState("");
//   const [contracts, setContracts] = useState([
//     { version: "1.0", message_count: 100, message_frequency_hz: 10 }
//   ]);

//   const handleSave = async () => {
//     // בניית האובייקט לפי מבנה ה-SimulationConfig ששלחת
//     const payload = {
//       scenario_name: scenarioName,
//       contracts: contracts // השרת יפרק את זה ל-ContractConfig ו-DataReader
//     };
    
//     try {
//       await createScenario(payload);
//       navigate('/simulations');
//     } catch (error) {
//       alert("שגיאה בשמירת הסימולציה");
//     }
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto font-['Heebo'] text-right" dir="rtl">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8 flex-row-reverse">
//         <div className="flex items-center gap-4 flex-row-reverse">
//           <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
//             <ChevronLeft size={24} className="rotate-180" />
//           </button>
//           <h1 className="text-[32px] font-bold text-slate-800">סימולציה חדשה</h1>
//         </div>
        
//         <button onClick={handleSave} className="bg-[#0a153f] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors">
//           שמור סימולציה
//         </button>
//       </div>

//       <div className="grid grid-cols-1 gap-6">
//         {/* פרטי סימולציה כלליים */}
//         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
//           <h2 className="text-xl font-bold mb-4 text-slate-700">הגדרות כלליות</h2>
//           <div className="flex flex-col gap-2">
//             <label className="text-sm font-medium text-slate-500">שם התרחיש (Scenario Name)</label>
//             <input 
//               value={scenarioName}
//               onChange={(e) => setScenarioName(e.target.value)}
//               placeholder="למשל: תרגיל יחידתי 1"
//               className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>
//         </div>

//         {/* ניהול חוזים (Contracts) - מבוסס על DataReader/Writer */}
//         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-slate-700">הגדרות חוזים (Contracts)</h2>
//             <button 
//               onClick={() => setContracts([...contracts, { version: "1.0", message_count: 0, message_frequency_hz: 0 }])}
//               className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
//             >
//               <Plus size={18} /> הוסף חוזה
//             </button>
//           </div>

//           <div className="space-y-4">
//             {contracts.map((contract, index) => (
//               <div key={index} className="p-4 border border-slate-100 bg-slate-50 rounded-2xl grid grid-cols-3 gap-4 relative">
//                 <div className="flex flex-col gap-1">
//                   <label className="text-xs text-slate-400">גרסה</label>
//                   <input className="p-2 rounded-lg border border-slate-200" value={contract.version} />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label className="text-xs text-slate-400 text-slate-400">כמות הודעות</label>
//                   <input type="number" className="p-2 rounded-lg border border-slate-200" value={contract.message_count} />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label className="text-xs text-slate-400">תדר (Hz)</label>
//                   <input type="number" className="p-2 rounded-lg border border-slate-200" value={contract.message_frequency_hz} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewSimulation;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Plus, Trash2, Clock, ShieldCheck, Activity } from 'lucide-react';
// import { listProfiles, createScenario } from "../api";

// const NewSimulation: React.FC = () => {
//   const navigate = useNavigate();
  
//   // State management
//   const [scenarioName, setScenarioName] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedProfile, setSelectedProfile] = useState("");
//   const [profiles, setProfiles] = useState<any[]>([]);
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);

//   const [phases, setPhases] = useState([
//     { name: "setup", actions: [] },
//     { name: "test", actions: [] }
//   ]);

//   useEffect(() => {
//     listProfiles().then(setProfiles).catch(console.error);
//   }, []);

//   const handleSave = async () => {
//     const payload = {
//       scenario_name: scenarioName,
//       description,
//       dds_profile_id: selectedProfile,
//       transport_latency: latency,
//       transport_jitter: jitter,
//       phases
//     };
    
//     try {
//       await createScenario(payload);
//       navigate('/simulations');
//     } catch (error) {
//       console.error("Save failed:", error);
//     }
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto font-['Heebo'] text-left" dir="ltr">
//       {/* Header - All English */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-[32px] font-bold text-slate-800">Create New Simulation</h1>
//         </div>
//         <button 
//           onClick={handleSave}
//           className="bg-[#0a153f] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#37A8D8] transition-all shadow-lg"
//         >
//           Save Simulation
//         </button>
//       </div>

//       <div className="space-y-6">
//         {/* General Settings */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
//           <h2 className="text-lg font-bold text-slate-700 mb-6">General Settings</h2>
//           <div className="grid grid-cols-2 gap-8">
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-500">Scenario Name</label>
//               <input 
//                 value={scenarioName}
//                 onChange={(e) => setScenarioName(e.target.value)}
//                 placeholder="e.g. sensor_basic_test"
//                 className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#37A8D8] outline-none"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-500">DDS Profile</label>
//               <select 
//                 className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#37A8D8] appearance-none outline-none"
//                 value={selectedProfile}
//                 onChange={(e) => setSelectedProfile(e.target.value)}
//               >
//                 <option value="">Select a profile...</option>
//                 {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//               </select>
//             </div>
//           </div>
//           <div className="mt-6 space-y-2">
//             <label className="text-sm font-bold text-slate-500">Description (Optional)</label>
//             <textarea 
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#37A8D8] outline-none"
//               rows={2}
//               placeholder="Optional description"
//             />
//           </div>
//         </div>

//         {/* Network Settings */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm grid grid-cols-2 gap-8">
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
//               <Clock size={16} /> Transport Latency (ms)
//             </label>
//             <input 
//               type="number" 
//               className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none" 
//               value={latency} 
//               onChange={e => setLatency(Number(e.target.value))} 
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
//               <Activity size={16} /> Latency Jitter (ms)
//             </label>
//             <input 
//               type="number" 
//               className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none" 
//               value={jitter} 
//               onChange={e => setJitter(Number(e.target.value))} 
//             />
//           </div>
//         </div>

//         {/* Phases Section */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-bold text-slate-800">Phases</h2>
//             <button className="text-[#37A8D8] font-bold flex items-center gap-1 hover:underline">
//               <Plus size={20} /> Add Phase
//             </button>
//           </div>
          
//           <div className="space-y-4">
//             {phases.map((phase, idx) => (
//               <div key={idx} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 flex justify-between items-center">
//                 <span className="font-bold text-slate-700 capitalize">{phase.name}</span>
//                 <div className="flex gap-4">
//                    <button className="text-sm font-bold text-[#37A8D8] hover:opacity-80">+ Action</button>
//                    <button className="text-sm font-bold text-red-400 hover:text-red-600">Remove</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Assertions Section */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
//           <div className="flex items-center gap-2 mb-6">
//             <ShieldCheck className="text-[#37A8D8]" size={20} />
//             <h2 className="text-lg font-bold text-slate-800">Assertions</h2>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             {['Delivery Complete', 'All Matched', 'No Incompatible QoS', 'No Errors'].map((label) => (
//               <div key={label} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-[#37A8D8]/20">
//                 <div className="w-5 h-5 border-2 border-[#37A8D8] rounded-md" />
//                 <span className="text-sm font-medium text-slate-700">{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewSimulation;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Clock, ShieldCheck, Activity, Settings, Database, Radio, Trash2 } from 'lucide-react';

// interface Action {
//   id: number;
//   type: 'Reader' | 'Writer';
//   messageCount: number;
//   frequency: number;
// }

// interface Phase {
//   id: number;
//   name: string;
//   actions: Action[];
// }

// const NewSimulation: React.FC = () => {
//   const navigate = useNavigate();
//   const [scenarioName, setScenarioName] = useState("");
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);
  
//   const [phases, setPhases] = useState<Phase[]>([
//     { id: 1, name: "SETUP", actions: [] as Action[] },
//     { id: 2, name: "TEST EXECUTION", actions: [] as Action[] }
//   ]);

//   const addAction = (phaseId: number, type: 'Reader' | 'Writer') => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { 
//           ...p, 
//           actions: [
//             ...p.actions, 
//             { id: Date.now(), type, messageCount: 10, frequency: 1 }
//           ] 
//         };
//       }
//       return p;
//     }));
//   };

//   const removeAction = (phaseId: number, actionId: number) => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { ...p, actions: p.actions.filter(a => a.id !== actionId) };
//       }
//       return p;
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-8 font-heebo text-left" dir="ltr">
//       {/* כותרת עליונה */}
//       <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold text-navy-950 uppercase tracking-tight">NEW SIMULATION</h1>
//         </div>
//         <button className="flex items-center gap-2 bg-[#141e52] text-white px-6 py-2.5 rounded-[6px] font-bold text-[12px] tracking-wide hover:bg-navy-900 transition-all shadow-sm">
//           <Save size={18} /> SAVE SCENARIO
//         </button>
//       </div>

//       <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
//         {/* הגדרות מרכזיות */}
//         <div className="col-span-8 space-y-6">
          
//           {/* General Information */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <Settings size={16} className="text-slate-400" />
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">General Information</h2>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[12px] font-bold text-navy-950">Scenario Name (Required)</label>
//               <input 
//                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] focus:border-navy-950 text-navy-950 outline-none transition-all placeholder:text-slate-300 font-medium"
//                 placeholder="Enter scenario identifier..."
//                 value={scenarioName}
//                 onChange={(e) => setScenarioName(e.target.value)}
//               />
//             </div>
//           </section>

//           {/* Execution Plan */}
//           <section className="bg-white rounded-[6px] border border-slate-200 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100 bg-white">
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Execution Plan</h2>
//             </div>
            
//             <div className="p-6 space-y-10">
//               {phases.map((phase) => (
//                 <div key={phase.id} className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-[11px] font-black text-blue-500 tracking-wider">
//                       PHASE {phase.id}: <span className="ml-2 text-navy-950 font-black">{phase.name}</span>
//                     </h3>
                    
//                     <div className="flex gap-2">
//                       {/* כפתור DATA WRITER בעיצוב עדין ונקי */}
//                       <button 
//                         onClick={() => addAction(phase.id, 'Writer')}
//                         className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-orange-300 text-orange-600 bg-white hover:bg-orange-50/30 transition-all uppercase tracking-wider"
//                       >
//                         + Data Writer
//                       </button>
                      
//                       {/* כפתור DATA READER בעיצוב עדין ונקי */}
//                       <button 
//                         onClick={() => addAction(phase.id, 'Reader')}
//                         className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-emerald-300 text-emerald-600 bg-white hover:bg-emerald-50/30 transition-all uppercase tracking-wider"
//                       >
//                         + Data Reader
//                       </button>
//                     </div>
//                   </div>

//                   {/* אזור פעולות */}
//                   <div className="min-h-[100px] border border-dashed border-slate-200 rounded-[6px] flex items-center justify-center p-4 bg-slate-50/20">
//                     {phase.actions.length === 0 ? (
//                       <span className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">No Actions Configured</span>
//                     ) : (
//                       <div className="w-full space-y-3">
//                         {phase.actions.map(action => (
//                           <div key={action.id} className="flex items-center justify-between p-4 bg-white rounded-[6px] border border-slate-200 relative group transition-all hover:shadow-sm">
//                             <div className="flex items-center gap-3">
//                               {action.type === 'Writer' ? (
//                                 <Radio size={15} className="text-orange-500" />
//                               ) : (
//                                 <Database size={15} className="text-emerald-500" />
//                               )}
//                               <span className="text-xs font-black text-navy-950 uppercase">
//                                 {action.type === 'Writer' ? 'DataWriter' : 'DataReader'}
//                               </span>
//                             </div>
//                             <div className="flex gap-6 text-[11px] font-bold text-slate-400">
//                               <span className="uppercase">Msg: <span className="text-navy-950">{action.messageCount}</span></span>
//                               <span className="uppercase">Freq: <span className="text-navy-950">{action.frequency}Hz</span></span>
//                             </div>
//                             <button 
//                               onClick={() => removeAction(phase.id, action.id)} 
//                               className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 bg-white border border-slate-200 p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-all"
//                             >
//                               <Trash2 size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* עמודת הגדרות רשת ו-Assertions */}
//         <div className="col-span-4 space-y-6">
//           {/* Network Emulation */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase mb-6">Network Emulation</h2>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
//                   <Clock size={14} className="text-slate-400" /> Latency (ms)
//                 </label>
//                 <input 
//                   type="number" 
//                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
//                   value={latency} 
//                   onChange={e => setLatency(Number(e.target.value))} 
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
//                   <Activity size={14} className="text-slate-400" /> Jitter (ms)
//                 </label>
//                 <input 
//                   type="number" 
//                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
//                   value={jitter} 
//                   onChange={e => setJitter(Number(e.target.value))} 
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Assertions - עכשיו בעיצוב לבן, נקי ואחיד בדיוק כמו כולם! */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <ShieldCheck size={16} className="text-slate-400" />
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Assertions</h2>
//             </div>
//             <div className="space-y-2">
//               {['DELIVERY COMPLETE', 'NO ERRORS', 'ALL MATCHED'].map(item => (
//                 <div key={item} className="flex items-center justify-between p-3.5 rounded-[6px] border border-slate-100 bg-slate-50/50">
//                   <span className="text-[10px] font-black tracking-wider text-navy-950">{item}</span>
//                   <input 
//                     type="checkbox" 
//                     className="w-4 h-4 rounded border-slate-300 text-[#141e52] focus:ring-0 focus:ring-offset-0 cursor-pointer" 
//                   />
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default NewSimulation;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Plus, Clock, ShieldCheck, Activity, Settings, Database, Radio, Trash2 } from 'lucide-react';

// interface Action {
//   id: number;
//   type: 'Reader' | 'Writer';
//   messageCount: number;
//   frequency: number;
// }

// interface Phase {
//   id: number;
//   name: string;
//   actions: Action[];
// }

// const NewSimulation: React.FC = () => {
//   const navigate = useNavigate();
//   const [scenarioName, setScenarioName] = useState("");
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);
  
//   const [phases, setPhases] = useState<Phase[]>([
//     { id: 1, name: "SETUP", actions: [] },
//     { id: 2, name: "TEST EXECUTION", actions: [] }
//   ]);

//   const addAction = (phaseId: number, type: 'Reader' | 'Writer') => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { ...p, actions: [...p.actions, { id: Date.now(), type, messageCount: 10, frequency: 1 }] };
//       }
//       return p;
//     }));
//   };

//   const removeAction = (phaseId: number, actionId: number) => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { ...p, actions: p.actions.filter(a => a.id !== actionId) };
//       }
//       return p;
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-8 font-heebo text-left" dir="ltr">
//       {/* כותרת עליונה */}
//       <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold text-navy-950 uppercase tracking-tight">NEW SIMULATION</h1>
//         </div>
//         <button className="flex items-center gap-2 bg-navy-950 text-white px-6 py-2.5 rounded-[6px] font-bold text-[12px] tracking-wide hover:bg-navy-900 transition-all shadow-sm">
//           <Save size={18} /> SAVE SCENARIO
//         </button>
//       </div>

//       <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
//         {/* הגדרות מרכזיות */}
//         <div className="col-span-8 space-y-6">
//           <section className="bg-white rounded-[6px] border-2 border-slate-100 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <Settings size={16} className="text-slate-400" />
//               <h2 className="text-[12px] font-black tracking-widest text-slate-500 uppercase">General Information</h2>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[13px] font-bold text-slate-700">Scenario Name (Required)</label>
//               <input 
//                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] focus:border-navy-950 outline-none transition-all"
//                 placeholder="Enter scenario identifier..."
//                 value={scenarioName}
//                 onChange={(e) => setScenarioName(e.target.value)}
//               />
//             </div>
//           </section>

//           {/* שלבי הרצה ללא ירוק/אדום צעקני */}
//           <section className="bg-white rounded-[6px] border-2 border-slate-100 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
//               <h2 className="text-[12px] font-black tracking-widest text-slate-500 uppercase">Execution Plan</h2>
//             </div>
//             <div className="p-6 space-y-10">
//               {phases.map((phase) => (
//                 <div key={phase.id} className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-[13px] font-black text-blue-500 tracking-wider">
//                       PHASE {phase.id}: <span className="ml-2 text-navy-950">{phase.name}</span>
//                     </h3>
//                     <div className="flex gap-2">
//                       <button 
//                         onClick={() => addAction(phase.id, 'Writer')}
//                         className="text-[11px] font-black px-4 py-2 rounded-[6px] border-2 border-slate-200 text-navy-950 hover:border-navy-950 hover:bg-slate-50 transition-all"
//                       >
//                         + DATA WRITER
//                       </button>
//                       <button 
//                         onClick={() => addAction(phase.id, 'Reader')}
//                         className="text-[11px] font-black px-4 py-2 rounded-[6px] border-2 border-slate-200 text-navy-950 hover:border-navy-950 hover:bg-slate-50 transition-all"
//                       >
//                         + DATA READER
//                       </button>
//                     </div>
//                   </div>

//                   <div className="min-h-[100px] border-2 border-dashed border-slate-100 rounded-[6px] flex items-center justify-center p-4 bg-slate-50/20">
//                     {phase.actions.length === 0 ? (
//                       <span className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">No Actions Configured</span>
//                     ) : (
//                       <div className="w-full space-y-3">
//                         {phase.actions.map(action => (
//                           <div key={action.id} className="flex items-center justify-between p-4 bg-white rounded-[6px] border border-slate-200 relative group">
//                              <div className="flex items-center gap-3">
//                                {action.type === 'Writer' ? <Radio size={16} className="text-navy-950" /> : <Database size={16} className="text-navy-950" />}
//                                <span className="text-xs font-black text-navy-950 uppercase">{action.type === 'Writer' ? 'DataWriter' : 'DataReader'}</span>
//                              </div>
//                              <div className="flex gap-6 text-[11px] font-bold text-slate-400">
//                                <span className="uppercase">Msg: <span className="text-navy-950">{action.messageCount}</span></span>
//                                <span className="uppercase">Freq: <span className="text-navy-950">{action.frequency}Hz</span></span>
//                              </div>
//                              <button onClick={() => removeAction(phase.id, action.id)} className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 bg-white border border-slate-200 p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-all">
//                                <Trash2 size={12} />
//                              </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* עמודת הגדרות רשת ו-Assertions מעוצבת ומאוחדת */}
//         <div className="col-span-4 space-y-6">
//           <section className="bg-white rounded-[6px] border-2 border-slate-100 p-6 shadow-sm">
//             <h2 className="text-[12px] font-black tracking-widest text-slate-500 uppercase mb-6">Network Emulation</h2>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-slate-400 flex items-center gap-2"><Clock size={14}/> Latency (ms)</label>
//                 <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-[6px] outline-none focus:bg-white focus:border-navy-950 transition-all" value={latency} onChange={e => setLatency(Number(e.target.value))} />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-slate-400 flex items-center gap-2"><Activity size={14}/> Jitter (ms)</label>
//                 <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-[6px] outline-none focus:bg-white focus:border-navy-950 transition-all" value={jitter} onChange={e => setJitter(Number(e.target.value))} />
//               </div>
//             </div>
//           </section>

//           {/* Assertions - קו עיצובי אחיד עם כותרת בצבע המותג */}
//           <section className="bg-white rounded-[6px] border-2 border-slate-100 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100 bg-navy-950 flex items-center gap-2">
//               <ShieldCheck size={16} className="text-white opacity-80" />
//               <h2 className="text-[11px] font-black tracking-widest text-white uppercase">Assertions</h2>
//             </div>
//             <div className="p-4 space-y-2">
//               {['DELIVERY COMPLETE', 'NO ERRORS', 'ALL MATCHED'].map(item => (
//                 <div key={item} className="flex items-center justify-between p-3 rounded-[6px] border border-slate-100 bg-slate-50/50">
//                   <span className="text-[11px] font-black text-navy-950">{item}</span>
//                   <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0" />
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default NewSimulation;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Plus, Clock, ShieldCheck, Activity, Settings, Database, Radio, Trash2 } from 'lucide-react';

// interface Action {
//   id: number;
//   type: 'Reader' | 'Writer';
//   messageCount: number;
//   frequency: number;
// }

// interface Phase {
//   id: number;
//   name: string;
//   actions: Action[];
// }

// const NewSimulation: React.FC = () => {
//   const navigate = useNavigate();
//   const mainColor = "#141E52"; // הצבע מהפיגמה שלך
  
//   const [scenarioName, setScenarioName] = useState("");
//   const [phases, setPhases] = useState<Phase[]>([
//     { id: 1, name: "SETUP", actions: [] },
//     { id: 2, name: "TEST EXECUTION", actions: [] }
//   ]);

//   const addAction = (phaseId: number, type: 'Reader' | 'Writer') => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { ...p, actions: [...p.actions, { id: Date.now(), type, messageCount: 10, frequency: 1 }] };
//       }
//       return p;
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-8 font-['Heebo']" dir="ltr">
//       {/* Header */}
//       <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200 text-left">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold" style={{ color: mainColor }}>NEW SIMULATION</h1>
//         </div>
//         <button className="flex items-center gap-2 bg-[#141E52] text-white px-6 py-2 rounded shadow-sm hover:opacity-90">
//           <Save size={18} /> SAVE SCENARIO
//         </button>
//       </div>

//       <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
//         <div className="col-span-8 space-y-6">
//           {/* General Info */}
//           <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm text-left">
//             <div className="flex items-center gap-2 mb-6">
//               <Settings size={16} className="text-slate-400" />
//               <h2 className="text-[12px] font-bold tracking-widest text-slate-500 uppercase">General Information</h2>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[13px] font-bold text-slate-700">Scenario Name (Required)</label>
//               <input 
//                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded focus:border-blue-500 outline-none transition-all"
//                 placeholder="Enter scenario identifier..."
//               />
//             </div>
//           </section>

//           {/* Execution Plan */}
//           <section className="bg-white rounded-lg border border-slate-200 shadow-sm text-left">
//             <div className="px-6 py-4 border-b border-slate-50">
//               <h2 className="text-[12px] font-bold tracking-widest text-slate-500 uppercase">Execution Plan</h2>
//             </div>
//             <div className="p-6 space-y-10">
//               {phases.map((phase) => (
//                 <div key={phase.id} className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-[13px] font-black" style={{ color: '#3B82F6' }}>
//                       PHASE {phase.id}: <span className="ml-2 text-slate-800">{phase.name}</span>
//                     </h3>
//                     <div className="flex gap-2">
//                       {/* כפתורים לפי ה-Layout בפיגמה (Border 2px, Radius 6px) */}
//                       <button 
//                         onClick={() => addAction(phase.id, 'Writer')}
//                         className="text-[11px] font-bold px-4 py-2 rounded-[6px] border-2 transition-all"
//                         style={{ borderColor: '#E2E8F0', color: '#141E52' }}
//                       >
//                         + DATA WRITER
//                       </button>
//                       <button 
//                         onClick={() => addAction(phase.id, 'Reader')}
//                         className="text-[11px] font-bold px-4 py-2 rounded-[6px] border-2 transition-all"
//                         style={{ borderColor: '#E2E8F0', color: '#141E52' }}
//                       >
//                         + DATA READER
//                       </button>
//                     </div>
//                   </div>

//                   <div className="min-h-[100px] border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center">
//                     {phase.actions.length === 0 ? (
//                       <span className="text-[11px] font-bold text-slate-300 tracking-widest">NO ACTIONS CONFIGURED</span>
//                     ) : (
//                       <div className="w-full p-4 space-y-2">
//                         {phase.actions.map(action => (
//                           <div key={action.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
//                              <span className="text-xs font-bold text-slate-600 uppercase">{action.type}</span>
//                              <div className="flex gap-4 text-[11px] font-medium text-slate-500">
//                                <span>MSG: {action.messageCount}</span>
//                                <span>FREQ: {action.frequency}Hz</span>
//                              </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* Sidebar */}
//         <div className="col-span-4 space-y-6">
//           <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm text-left">
//             <h2 className="text-[12px] font-bold tracking-widest text-slate-500 uppercase mb-6">Network Emulation</h2>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-slate-400 flex items-center gap-2"><Clock size={14}/> Latency (ms)</label>
//                 <input type="number" className="w-full px-4 py-2 bg-[#f8fafc] border border-slate-200 rounded outline-none" defaultValue="0" />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-slate-400 flex items-center gap-2"><Activity size={14}/> Jitter (ms)</label>
//                 <input type="number" className="w-full px-4 py-2 bg-[#f8fafc] border border-slate-200 rounded outline-none" defaultValue="0" />
//               </div>
//             </div>
//           </section>

//           {/* תיקון ה-Assertions - רקע בהיר לפי קו אחיד */}
//           <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden text-left">
//             <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2" style={{ backgroundColor: '#141E52' }}>
//               <ShieldCheck size={16} className="text-blue-400" />
//               <h2 className="text-[12px] font-bold tracking-widest text-white uppercase">Assertions</h2>
//             </div>
//             <div className="p-4 space-y-2">
//               {['DELIVERY COMPLETE', 'NO ERRORS', 'ALL MATCHED'].map(item => (
//                 <div key={item} className="flex items-center justify-between p-3 rounded border border-slate-100 bg-slate-50/50">
//                   <span className="text-[11px] font-bold text-[#141E52]">{item}</span>
//                   <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0" />
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default NewSimulation;


// import { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Plus, Trash2, Play, ChevronDown, ChevronRight, ClipboardList, Upload } from "lucide-react";
// import { listScenarios, listProfiles, listTemplates, generateScenario, createScenario, deleteScenario, runScenario, importYamlSimulation, type ScenarioInfo, type ProfileInfo, type TemplateInfo } from "../api";
// import { useToast } from "../components/Toast";

// const ACTION_TYPES = [
//   { value: "start_participant", label: "Start Participant" },
//   { value: "stop_participant", label: "Stop Participant" },
//   { value: "send_messages", label: "Send Messages" },
//   { value: "wait", label: "Wait" },
// ];

// const ASSERTION_TYPES = [
//   { value: "delivery_complete", label: "Delivery Complete" },
//   { value: "all_matched", label: "All Matched" },
//   { value: "no_incompatible_qos", label: "No Incompatible QoS" },
//   { value: "no_errors", label: "No Errors" },
//   { value: "ordered_delivery", label: "Ordered Delivery" },
//   { value: "discovery_complete", label: "Discovery Complete" },
//   { value: "max_loss_percent", label: "Max Loss %" },
//   { value: "domain_isolated", label: "Domain Isolated" },
// ];

// interface ActionDraft { type: string; participant_ref: string; params: Record<string, any> }
// interface PhaseDraft { name: string; phase_type: string; actions: ActionDraft[]; expanded: boolean }
// interface AssertionDraft { type: string; scope: string; params: Record<string, any> }

// export default function Simulations() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [scenarios, setScenarios] = useState<ScenarioInfo[]>([]);
//   const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [showCreate, setShowCreate] = useState(false);
//   const [scenarioName, setScenarioName] = useState("");
//   const [scenarioDesc, setScenarioDesc] = useState("");
//   const [selectedProfileId, setSelectedProfileId] = useState("");
//   const [phases, setPhases] = useState<PhaseDraft[]>([
//     { name: "setup", phase_type: "setup", actions: [], expanded: true },
//     { name: "test", phase_type: "test", actions: [], expanded: true },
//   ]);
//   const [assertions, setAssertions] = useState<AssertionDraft[]>([
//     { type: "delivery_complete", scope: "all", params: {} },
//     { type: "no_errors", scope: "all", params: {} },
//   ]);
//   const [creating, setCreating] = useState(false);
//   const [templates, setTemplates] = useState<TemplateInfo[]>([]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");
//   const [generating, setGenerating] = useState(false);
//   const yamlInputRef = useRef<HTMLInputElement>(null);
//   const [importing, setImporting] = useState(false);
//   const [transportLatencyMs, setTransportLatencyMs] = useState(0);
//   const [transportJitterMs, setTransportJitterMs] = useState(0);
//   const [participantNames, setParticipantNames] = useState<string[]>([]);

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [s, p, t] = await Promise.all([listScenarios(), listProfiles(), listTemplates()]);
//       setScenarios(s); setProfiles(p); setTemplates(t); setError(null);
//     } catch (e: any) { setError(e.message); }
//     finally { setLoading(false); }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   useEffect(() => {
//     if (!selectedProfileId) { setParticipantNames([]); return; }
//     const profile = profiles.find((p) => p.id === selectedProfileId);
//     if (profile?.profile_data) {
//       const names: string[] = [];
//       for (const lib of profile.profile_data.participant_libraries || [])
//         for (const p of lib.participants || []) names.push(p.name);
//       setParticipantNames(names);
//     }
//   }, [selectedProfileId, profiles]);

//   const addAction = (phaseIdx: number) => {
//     const updated = [...phases];
//     updated[phaseIdx].actions.push({ type: "start_participant", participant_ref: participantNames[0] || "", params: {} });
//     setPhases(updated);
//   };

//   const removeAction = (phaseIdx: number, actionIdx: number) => {
//     const updated = [...phases]; updated[phaseIdx].actions.splice(actionIdx, 1); setPhases(updated);
//   };

//   const updateAction = (phaseIdx: number, actionIdx: number, field: string, value: any) => {
//     const updated = [...phases]; (updated[phaseIdx].actions[actionIdx] as any)[field] = value; setPhases(updated);
//   };

//   const addPhase = () => setPhases([...phases, { name: `phase_${phases.length + 1}`, phase_type: "custom", actions: [], expanded: true }]);
//   const removePhase = (idx: number) => setPhases(phases.filter((_, i) => i !== idx));

//   const toggleAssertion = (type: string) => {
//     const existing = assertions.findIndex((a) => a.type === type);
//     if (existing >= 0) setAssertions(assertions.filter((_, i) => i !== existing));
//     else setAssertions([...assertions, { type, scope: "all", params: {} }]);
//   };

//   const handleCreate = async () => {
//     if (!scenarioName.trim()) return;
//     setCreating(true);
//     try {
//       const scenarioConfig = { name: scenarioName, description: scenarioDesc, dds_profile_id: selectedProfileId || null, timeout_seconds: 30, transport_latency_ms: transportLatencyMs, transport_jitter_ms: transportJitterMs, phases: phases.map((p) => ({ name: p.name, phase_type: p.phase_type, actions: p.actions.map((a) => ({ type: a.type, participant_ref: a.participant_ref || null, params: a.params })) })), assertions: assertions.map((a) => ({ type: a.type, scope: a.scope, params: a.params })), deploy_targets: [] };
//       await createScenario({ name: scenarioName, description: scenarioDesc, dds_profile_id: selectedProfileId || undefined, scenario_config: scenarioConfig });
//       setShowCreate(false); setScenarioName(""); setScenarioDesc("");
//       toast("Simulation created successfully", "success");
//       await load();
//     } catch (e: any) { toast(e.message, "error"); }
//     finally { setCreating(false); }
//   };

//   const handleDelete = async (id: string) => {
//     try { await deleteScenario(id); toast("Simulation deleted", "success"); await load(); }
//     catch (e: any) { toast(e.message, "error"); }
//   };

//   const handleRun = async (id: string) => {
//     try { const result = await runScenario(id); toast("Simulation started", "info"); navigate(`/run/${result.run_id}`); }
//     catch (e: any) { toast(e.message, "error"); }
//   };

//   const handleGenerate = async () => {
//     if (!selectedProfileId || !selectedTemplate) return;
//     setGenerating(true);
//     try {
//       const result = await generateScenario(selectedProfileId, selectedTemplate, scenarioName || undefined);
//       const sc = result.scenario;
//       if (sc.name && !scenarioName) setScenarioName(sc.name);
//       if (sc.description) setScenarioDesc(sc.description);
//       if (sc.transport_latency_ms != null) setTransportLatencyMs(sc.transport_latency_ms);
//       if (sc.transport_jitter_ms != null) setTransportJitterMs(sc.transport_jitter_ms);
//       const newPhases: PhaseDraft[] = (sc.phases || []).map((p: any) => ({ name: p.name, phase_type: p.phase_type || "custom", actions: (p.actions || []).map((a: any) => ({ type: a.type, participant_ref: a.participant_ref || "", params: a.params || {} })), expanded: true }));
//       setPhases(newPhases.length > 0 ? newPhases : phases);
//       const newAssertions: AssertionDraft[] = (sc.assertions || []).map((a: any) => ({ type: a.type, scope: a.scope || "all", params: a.params || {} }));
//       setAssertions(newAssertions.length > 0 ? newAssertions : assertions);
//     } catch (e: any) { setError(e.message); }
//     finally { setGenerating(false); }
//   };

//   const handleYamlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImporting(true); setError(null);
//     try { const yamlContent = await file.text(); await importYamlSimulation(yamlContent); toast(`Imported "${file.name}" as a simulation`, "success"); await load(); }
//     catch (err: any) { toast(`YAML import failed: ${err.message}`, "error"); }
//     finally { setImporting(false); if (yamlInputRef.current) yamlInputRef.current.value = ""; }
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Simulations</h1>
//           <p className="text-sm text-gray-400 mt-1">Define, configure, and run DDS deployment simulations</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <input ref={yamlInputRef} type="file" accept=".yaml,.yml" onChange={handleYamlImport} className="hidden" />
//           <button onClick={() => yamlInputRef.current?.click()} disabled={importing} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
//             <Upload size={16} />{importing ? "Importing..." : "Import YAML"}
//           </button>
//           <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-medium transition-colors">
//             <Plus size={16} />New Simulation
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">
//           {error}<button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-300">dismiss</button>
//         </div>
//       )}

//       {showCreate && (
//         <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
//           <h3 className="text-sm font-semibold text-gray-300">New Simulation</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs text-gray-400 mb-1">Name</label>
//               <input value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" placeholder="e.g. sensor_basic_test" />
//             </div>
//             <div>
//               <label className="block text-xs text-gray-400 mb-1">DDS Profile</label>
//               <select value={selectedProfileId} onChange={(e) => setSelectedProfileId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm">
//                 <option value="">Select a profile...</option>
//                 {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//               </select>
//             </div>
//           </div>
//           <div>
//             <label className="block text-xs text-gray-400 mb-1">Description</label>
//             <input value={scenarioDesc} onChange={(e) => setScenarioDesc(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" placeholder="Optional description" />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs text-gray-400 mb-1">Transport Latency (ms)</label>
//               <input type="number" min="0" value={transportLatencyMs} onChange={(e) => setTransportLatencyMs(parseFloat(e.target.value) || 0)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" />
//             </div>
//             <div>
//               <label className="block text-xs text-gray-400 mb-1">Latency Jitter (ms)</label>
//               <input type="number" min="0" value={transportJitterMs} onChange={(e) => setTransportJitterMs(parseFloat(e.target.value) || 0)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" />
//             </div>
//           </div>

//           {selectedProfileId && templates.length > 0 && (
//             <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
//               <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Generate from Template</h4>
//               <div className="flex items-center gap-3">
//                 <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm">
//                   <option value="">Select a template...</option>
//                   {templates.map((t) => <option key={t.name} value={t.name}>{t.name.replace(/_/g, " ")} — {t.description}</option>)}
//                 </select>
//                 <button onClick={handleGenerate} disabled={!selectedTemplate || generating} className="px-4 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded text-sm font-medium transition-colors whitespace-nowrap">
//                   {generating ? "Generating..." : "Generate"}
//                 </button>
//               </div>
//             </div>
//           )}

//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <h4 className="text-sm font-semibold text-gray-300">Phases</h4>
//               <button onClick={addPhase} className="text-xs text-cyan-400 hover:text-cyan-300">+ Add Phase</button>
//             </div>
//             <div className="space-y-2">
//               {phases.map((phase, pi) => (
//                 <div key={pi} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <button onClick={() => { const u = [...phases]; u[pi].expanded = !u[pi].expanded; setPhases(u); }}>
//                         {phase.expanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
//                       </button>
//                       <input value={phase.name} onChange={(e) => { const u = [...phases]; u[pi].name = e.target.value; setPhases(u); }} className="bg-transparent border-b border-gray-700 text-sm font-medium px-1 py-0.5 w-32" />
//                       <span className="text-xs text-gray-500">({phase.actions.length} actions)</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button onClick={() => addAction(pi)} className="text-xs text-cyan-400 hover:text-cyan-300">+ Action</button>
//                       {phases.length > 1 && <button onClick={() => removePhase(pi)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
//                     </div>
//                   </div>
//                   {phase.expanded && phase.actions.length > 0 && (
//                     <div className="mt-2 space-y-2">
//                       {phase.actions.map((action, ai) => (
//                         <div key={ai} className="flex items-center gap-2 bg-gray-800 rounded p-2">
//                           <select value={action.type} onChange={(e) => updateAction(pi, ai, "type", e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs">
//                             {ACTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
//                           </select>
//                           {(action.type === "start_participant" || action.type === "stop_participant" || action.type === "send_messages") && (
//                             <select value={action.participant_ref} onChange={(e) => updateAction(pi, ai, "participant_ref", e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs">
//                               <option value="">Participant...</option>
//                               {participantNames.map((n) => <option key={n} value={n}>{n}</option>)}
//                             </select>
//                           )}
//                           {action.type === "send_messages" && (
//                             <><input type="number" placeholder="count" value={action.params.count || ""} onChange={(e) => updateAction(pi, ai, "params", { ...action.params, count: parseInt(e.target.value) || 10 })} className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs w-20" /><span className="text-xs text-gray-500">msgs</span></>
//                           )}
//                           {action.type === "wait" && (
//                             <><input type="number" step="0.1" placeholder="seconds" value={action.params.seconds || ""} onChange={(e) => updateAction(pi, ai, "params", { seconds: parseFloat(e.target.value) || 1 })} className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs w-20" /><span className="text-xs text-gray-500">sec</span></>
//                           )}
//                           <button onClick={() => removeAction(pi, ai)} className="ml-auto text-gray-500 hover:text-red-400"><Trash2 size={12} /></button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div>
//             <h4 className="text-sm font-semibold text-gray-300 mb-2">Assertions</h4>
//             <div className="grid grid-cols-2 gap-2">
//               {ASSERTION_TYPES.map((at) => {
//                 const active = assertions.some((a) => a.type === at.value);
//                 return (
//                   <button key={at.value} onClick={() => toggleAssertion(at.value)} className={`flex items-center gap-2 px-3 py-2 rounded text-xs text-left transition-colors ${active ? "bg-cyan-900/30 text-cyan-300 border border-cyan-800" : "bg-gray-900 text-gray-400 border border-gray-700 hover:border-gray-600"}`}>
//                     <ClipboardList size={12} />{at.label}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="flex justify-end gap-2">
//             <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200">Cancel</button>
//             <button onClick={handleCreate} disabled={creating || !scenarioName} className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded text-sm font-medium transition-colors">
//               {creating ? "Creating..." : "Create Simulation"}
//             </button>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div className="text-center text-gray-500 py-12">Loading simulations...</div>
//       ) : scenarios.length === 0 ? (
//         <div className="text-center text-gray-500 py-12">No simulations yet. Create one or import a YAML config.</div>
//       ) : (
//         <div className="space-y-3">
//           {scenarios.map((s) => {
//             const config = s.scenario_config || {};
//             const phaseCount = config.phases?.length || 0;
//             const assertionCount = config.assertions?.length || 0;
//             const profileMatch = profiles.find((p) => p.id === s.dds_profile_id);
//             return (
//               <div key={s.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-semibold">{s.name}</h3>
//                     <p className="text-xs text-gray-400 mt-0.5">{s.description || "No description"} · {profileMatch ? `Profile: ${profileMatch.name}` : "No profile linked"}</p>
//                     <div className="flex gap-3 mt-1 text-xs text-gray-500">
//                       <span>{phaseCount} phases</span><span>{assertionCount} assertions</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button onClick={() => handleRun(s.id)} disabled={!s.dds_profile_id} className="flex items-center gap-1 px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:opacity-40 rounded text-xs font-medium transition-colors" title={s.dds_profile_id ? "Run simulation" : "Link a profile first"}>
//                       <Play size={12} />Run
//                     </button>
//                     <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Plus, Trash2, Play, ChevronDown, ChevronRight, ClipboardList, Upload } from "lucide-react";
// import { listScenarios, listProfiles, listTemplates, generateScenario, createScenario, deleteScenario, runScenario, importYamlSimulation, type ScenarioInfo, type ProfileInfo, type TemplateInfo } from "../api";
// import { useToast } from "../components/Toast";

// // ... (ACTION_TYPES ו-ASSERTION_TYPES נשארים אותו דבר)

// export default function Simulations() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const yamlInputRef = useRef<HTMLInputElement>(null);
  
//   // States
//   const [scenarios, setScenarios] = useState<ScenarioInfo[]>([]);
//   const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showCreate, setShowCreate] = useState(false);
//   const [importing, setImporting] = useState(false);

//   // Form States (עבור יצירת סימולציה חדשה)
//   const [scenarioName, setScenarioName] = useState("");
//   const [scenarioDesc, setScenarioDesc] = useState("");
//   const [selectedProfileId, setSelectedProfileId] = useState("");
//   const [phases, setPhases] = useState<any[]>([
//     { name: "setup", phase_type: "setup", actions: [], expanded: true },
//     { name: "test", phase_type: "test", actions: [], expanded: true },
//   ]);

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [s, p] = await Promise.all([listScenarios(), listProfiles()]);
//       setScenarios(s); 
//       setProfiles(p); 
//       setError(null);
//     } catch (e: any) { setError(e.message); }
//     finally { setLoading(false); }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const handleYamlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImporting(true);
//     try {
//       const yamlContent = await file.text();
//       await importYamlSimulation(yamlContent);
//       toast(`Imported "${file.name}" successfully`, "success");
//       await load();
//     } catch (err: any) { toast(err.message, "error"); }
//     finally { setImporting(false); if (yamlInputRef.current) yamlInputRef.current.value = ""; }
//   };

//   const handleRun = async (id: string) => {
//     try {
//       const result = await runScenario(id);
//       toast("Simulation started", "info");
//       navigate(`/run/${result.run_id}`);
//     } catch (e: any) { toast(e.message, "error"); }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Are you sure?")) return;
//     try { await deleteScenario(id); toast("Deleted", "success"); await load(); }
//     catch (e: any) { toast(e.message, "error"); }
//   };

//   return (
//     <div className="space-y-8 font-['Heebo']" dir="rtl">
//       {/* Header Section */}
//       <div className="flex justify-between items-end">
//         <div className="text-right">
//           <h1 className="text-[32px] font-bold text-[#141E52]">Simulations</h1>
//           <p className="text-gray-500 mt-1">Define, configure, and run DDS deployment simulations</p>
//         </div>
        
//         <div className="flex gap-4" dir="ltr">
//           {/* כפתור Import YAML מקושר ל-Input הנסתר */}
//           <input ref={yamlInputRef} type="file" accept=".yaml,.yml" onChange={handleYamlImport} className="hidden" />
//           <button 
//             onClick={() => yamlInputRef.current?.click()}
//             disabled={importing}
//             className="flex items-center justify-center gap-3 w-[280px] h-[63px] border-2 border-[#3B82F6] text-[#3B82F6] rounded-lg font-medium hover:bg-blue-50 transition-colors bg-white shadow-sm disabled:opacity-50"
//           >
//             <span className="text-[18px]">{importing ? "Importing..." : "Import From Computer"}</span>
//             <Upload size={22} />
//           </button>

//           {/* כפתור New Simulation */}
//           <button 
//             onClick={() => setShowCreate(!showCreate)}
//             className="flex items-center justify-center gap-2 px-8 h-[63px] bg-[#00BCD4] text-white rounded-lg font-medium hover:bg-[#00ACC1] transition-colors shadow-md"
//           >
//             <Plus size={22} />
//             <span className="text-[18px]">New Simulation</span>
//           </button>
//         </div>
//       </div>

//       {/* הודעת שגיאה אם קיימת */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-right">
//           {error}
//         </div>
//       )}

//       {/* טופס יצירה מהירה (מופיע בלחיצה על New) */}
//       {showCreate && (
//         <div className="bg-white border-2 border-cyan-100 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4">
//            <h2 className="text-xl font-bold mb-4 text-[#141E52]">Create New Simulation</h2>
//            {/* כאן אפשר להוסיף את שדות הטופס המקוריים שלך בעיצוב נקי */}
//            <div className="flex gap-4">
//               <input 
//                 placeholder="Simulation Name" 
//                 className="flex-1 border rounded-lg px-4 py-2"
//                 value={scenarioName}
//                 onChange={(e) => setScenarioName(e.target.value)}
//               />
//               <button className="bg-cyan-600 text-white px-6 py-2 rounded-lg" onClick={() => setShowCreate(false)}>Close</button>
//            </div>
//         </div>
//       )}

//       {/* רשימת הסימולציות */}
//       <div className="space-y-4">
//         {loading ? (
//           <div className="text-center py-12 text-gray-400">Loading simulations...</div>
//         ) : scenarios.length === 0 ? (
//           <div className="text-center py-12 text-gray-400">No simulations found.</div>
//         ) : (
//           scenarios.map((s) => {
//             const config = s.scenario_config || {};
//             const profileMatch = profiles.find((p) => p.id === s.dds_profile_id);
            
//             return (
//               <div key={s.id} className="bg-[#EBEDF0] border border-gray-200 rounded-xl p-6 flex justify-between items-center group hover:shadow-md transition-all">
//                 <div className="space-y-1 text-right">
//                   <h3 className="text-xl font-bold text-[#141E52]">{s.name}</h3>
//                   <p className="text-gray-600 text-sm">
//                     {s.description || "No description provided"} • 
//                     <span className="font-semibold text-blue-600 mr-1">
//                        {profileMatch ? `Profile: ${profileMatch.name}` : "No profile linked"}
//                     </span>
//                   </p>
//                   <div className="flex gap-4 text-[12px] text-gray-400 font-bold uppercase tracking-wider">
//                     <span>{config.phases?.length || 0} PHASES</span>
//                     <span>{config.assertions?.length || 0} ASSERTIONS</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4" dir="ltr">
//                   <button 
//                     onClick={() => handleRun(s.id)}
//                     disabled={!s.dds_profile_id}
//                     className="flex items-center gap-2 px-6 h-[42px] bg-[#10B981] text-white rounded-lg font-bold text-sm hover:bg-[#059669] transition-colors disabled:opacity-40"
//                   >
//                     <Play size={16} fill="white" />
//                     RUN
//                   </button>
//                   <button 
//                     onClick={() => handleDelete(s.id)}
//                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-all"
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Plus, Trash2, Play, Upload } from "lucide-react";
// import { listScenarios, listProfiles, deleteScenario, runScenario, importYamlSimulation, type ScenarioInfo, type ProfileInfo } from "../api";
// import { useToast } from "../components/Toast";

// export default function Simulations() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const yamlInputRef = useRef<HTMLInputElement>(null);
  
//   const [scenarios, setScenarios] = useState<ScenarioInfo[]>([]);
//   const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showCreate, setShowCreate] = useState(false);
//   const [importing, setImporting] = useState(false);

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [s, p] = await Promise.all([listScenarios(), listProfiles()]);
//       setScenarios(s); 
//       setProfiles(p); 
//       setError(null);
//     } catch (e: any) { setError(e.message); }
//     finally { setLoading(false); }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const handleYamlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImporting(true);
//     try {
//       const yamlContent = await file.text();
//       await importYamlSimulation(yamlContent);
//       toast(`Imported "${file.name}" successfully`, "success");
//       await load();
//     } catch (err: any) { toast(err.message, "error"); }
//     finally { setImporting(false); if (yamlInputRef.current) yamlInputRef.current.value = ""; }
//   };

//   const handleRun = async (id: string) => {
//     try {
//       const result = await runScenario(id);
//       toast("Simulation started", "info");
//       navigate(`/run/${result.run_id}`);
//     } catch (e: any) { toast(e.message, "error"); }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("בטוח שברצונך למחוק?")) return;
//     try { await deleteScenario(id); toast("Deleted", "success"); await load(); }
//     catch (e: any) { toast(e.message, "error"); }
//   };

//   return (
//     <div className="p-8 space-y-8 font-['Heebo']" dir="rtl">
//       {/* Header Section - כפתורים בשמאל, כותרת בימין */}
//       <div className="flex flex-row-reverse justify-between items-start">
//         <div className="text-right">
//           <h1 className="text-[40px] font-bold text-[#141E52] leading-none">Simulations</h1>
//           <p className="text-gray-500 mt-2 text-lg">Define, configure, and run DDS deployment simulations</p>
//         </div>
        
//         <div className="flex gap-4 items-center">
//           {/* כפתור New Simulation */}
//           <button 
//             onClick={() => setShowCreate(!showCreate)}
//             className="flex items-center justify-center gap-2 px-6 h-[63px] bg-[#00BCD4] text-white rounded-lg font-bold text-[18px] hover:bg-[#00ACC1] transition-all shadow-sm"
//           >
//             <Plus size={24} />
//             <span>New Simulation</span>
//           </button>

//           {/* כפתור Import מהפיגמה */}
//           <input ref={yamlInputRef} type="file" accept=".yaml,.yml" onChange={handleYamlImport} className="hidden" />
//           <button 
//             onClick={() => yamlInputRef.current?.click()}
//             disabled={importing}
//             className="flex items-center justify-center gap-3 w-[280px] h-[63px] border-2 border-[#3B82F6] text-[#3B82F6] rounded-lg font-bold text-[18px] hover:bg-blue-50 transition-all bg-white"
//           >
//             <span>{importing ? "Importing..." : "Import From Computer"}</span>
//             <Upload size={22} />
//           </button>
//         </div>
//       </div>

//       {/* הודעת שגיאה */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-right">
//           {error}
//         </div>
//       )}

//       {/* רשימת הסימולציות - כפתור בשמאל, טקסט בימין */}
//       <div className="space-y-4">
//         {loading ? (
//           <div className="text-center py-12 text-gray-400">טוען סימולציות...</div>
//         ) : (
//           scenarios.map((s) => {
//             const config = s.scenario_config || {};
//             const profileMatch = profiles.find((p) => p.id === s.dds_profile_id);
            
//             return (
//               <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-row-reverse justify-between items-center shadow-sm hover:shadow-md transition-all">
//                 {/* תוכן בימין */}
//                 <div className="text-right">
//                   <h3 className="text-[24px] font-bold text-[#141E52]">{s.name}</h3>
//                   <p className="text-gray-500 text-md mt-1">
//                     {s.description || "No description"} • 
//                     <span className="text-[#3B82F6] font-semibold mr-1">
//                        Profile: {profileMatch ? profileMatch.name : "System Default"}
//                     </span>
//                   </p>
//                   <div className="flex flex-row-reverse gap-6 mt-2 text-[13px] text-gray-400 font-bold uppercase tracking-wider">
//                     <span>{config.phases?.length || 0} PHASES</span>
//                     <span>{config.assertions?.length || 0} ASSERTIONS</span>
//                   </div>
//                 </div>

//                 {/* כפתורים בשמאל */}
//                 <div className="flex items-center gap-4">
//                   <button 
//                     onClick={() => handleRun(s.id)}
//                     className="flex items-center justify-center gap-2 w-[110px] h-[48px] bg-[#10B981] text-white rounded-lg font-bold text-[16px] hover:bg-[#059669] transition-all"
//                   >
//                     <Play size={18} fill="white" />
//                     RUN
//                   </button>
//                   <button 
//                     onClick={() => handleDelete(s.id)}
//                     className="p-2 text-gray-300 hover:text-red-500 transition-colors"
//                   >
//                     <Trash2 size={24} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Plus, Play, Trash2, Upload, Activity, Database, Search } from 'lucide-react';

// // אימפורטים מהפרויקט המקורי - נאמנות מלאה ל-api.ts
// import { 
//   listScenarios, 
//   listProfiles, 
//   deleteScenario, 
//   runScenario, 
//   importYamlSimulation, 
//   type ScenarioInfo, 
//   type ProfileInfo 
// } from "../api";

// const Simulations: React.FC = () => {
//   const navigate = useNavigate();
//   const [simulations, setSimulations] = useState<ScenarioInfo[]>([]);
//   const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [sims, pros] = await Promise.all([
//           listScenarios(),
//           listProfiles()
//         ]);
//         setSimulations(sims);
//         setProfiles(pros);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (window.confirm("האם את בטוחה שברצונך למחוק את הסימולציה?")) {
//       try {
//         await deleteScenario(id);
//         setSimulations(prev => prev.filter(s => s.id !== id));
//       } catch (error) {
//         alert("שגיאה במחיקת הסימולציה");
//       }
//     }
//   };

//   const filteredSims = simulations.filter(s => 
//     s.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <div className="p-8 text-center font-['Heebo']">טוען סימולציות...</div>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto font-['Heebo']">
//       {/* Header Section - לפי גודל Header בפיגמה */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-[32px] font-bold text-slate-800 leading-tight">Simulations</h1>
//           <p className="text-[16px] font-normal text-slate-500">ניהול והרצת תרחישי סימולציה</p>
//         </div>
        
//         <div className="flex gap-3">
//           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[16px] font-normal">
//             <Upload size={18} />
//             Import YAML
//           </button>
//           {/* צבע סגול מותאם New Simulation */}
//           <button className="flex items-center gap-2 px-4 py-2 bg-[#0a153f] text-white rounded-lg hover:bg-[#37A8D8] transition-colors text-[16px] font-medium">
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
//           placeholder="חיפוש סימולציה..."
//           className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A8D8]/20 text-[16px]"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredSims.map((s) => {
//           const profile = profiles.find(p => p.id === s.dds_profile_id);
          
//           return (
//             <div key={s.id} className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="p-3 bg-[#f0eeff] rounded-xl text-[#5c4cf4]">
//                   <Activity size={24} />
//                 </div>
//                 <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
//                   <Trash2 size={18} />
//                 </button>
//               </div>

//               {/* שם המערכת - לפי Subtitle בפיגמה */}
//               <h3 className="text-[24px] font-medium text-slate-800 mb-1 leading-snug">{s.name}</h3>
//               {/* תיאור - לפי text Regular בפיגמה[cite: 1] */}
//               <p className="text-[16px] font-normal text-slate-500 mb-4 line-clamp-2">{s.description || 'אין תיאור זמין'}</p>

//               <div className="flex items-center gap-2 mb-6">
//                 <Database size={16} className="text-[#37A8D8]" />
//                 <span className="text-[16px] font-medium text-slate-600">Profile:</span>
//                 <span className="text-[14px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-normal">
//                   {profile?.name || 'System Default'}
//                 </span>
//               </div>

//               {/* Phases & Assertions - שימוש ב-scenario_config מה-API[cite: 1] */}
//               <div className="grid grid-cols-2 gap-4 mb-6 border-y border-slate-50 py-4">
//                 <div className="text-center">
//                   <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Phases</p>
//                   <p className="text-[20px] font-medium text-slate-700">
//                     {s.scenario_config?.phases?.length || 0}
//                   </p>
//                 </div>
//                 <div className="text-center border-l border-slate-100">
//                   <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Assertions</p>
//                   <p className="text-[20px] font-medium text-slate-700">
//                     {s.scenario_config?.assertions?.length || 0}
//                   </p>
//                 </div>
//               </div>

//               {/* כפתור Run - לפי הצבע המדויק #37A8D8 מהפיגמה[cite: 1] */}
//               <button 
//                 onClick={() => navigate(`/run/${s.id}`)}
//                 className="w-full flex items-center justify-center gap-2 bg-[#37A8D8] text-white py-3 rounded-lg hover:bg-[#2e8db6] font-medium text-[16px] transition-colors"
//               >
//                 <Play size={18} fill="currentColor" />
//                 Run
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Simulations;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Clock, ShieldCheck, Activity, Settings, Database, Radio, Trash2 } from 'lucide-react';
// import { useToast } from '../components/Toast'; // ייבוא הטלוויזיה של ה-Toasts
// import { createScenario } from '../api'; // ייבוא פונקציית השמירה מה-API

// interface Action {
//   id: number;
//   type: 'Reader' | 'Writer';
//   messageCount: number;
//   frequency: number;
// }

// interface Phase {
//   id: number;
//   name: string;
//   actions: Action[];
// }

// const NewSimulation: React.FC = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast(); // שימוש ב-Toast Context
//   const [scenarioName, setScenarioName] = useState("");
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);
//   const [saving, setSaving] = useState(false);
  
//   // הגדרת ה-State של ה-checkboxes עבור ה-Assertions
//   const [assertions, setAssertions] = useState({
//     deliveryComplete: false,
//     noErrors: false,
//     allMatched: false,
//   });

//   const [phases, setPhases] = useState<Phase[]>([
//     { id: 1, name: "SETUP", actions: [] as Action[] },
//     { id: 2, name: "TEST EXECUTION", actions: [] as Action[] }
//   ]);

//   const addAction = (phaseId: number, type: 'Reader' | 'Writer') => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { 
//           ...p, 
//           actions: [
//             ...p.actions, 
//             { id: Date.now(), type, messageCount: 10, frequency: 1 }
//           ] 
//         };
//       }
//       return p;
//     }));
//   };

//   const removeAction = (phaseId: number, actionId: number) => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { ...p, actions: p.actions.filter(a => a.id !== actionId) };
//       }
//       return p;
//     }));
//   };

//   // פונקציית השמירה עם הוולידציות לפי מסמך הדרישות
//   const handleSave = async () => {
//     console.log("SAVE BUTTON CLICKED! Name:", scenarioName); // <--- שורת הבדיקה
//     // 1. בדיקת חובה: שם הסימולציה
//     if (!scenarioName.trim()) {
//       toast("Scenario name is required!", "error");
//       return;
//     }

//     // 2. בדיקת חובה: לפחות פעולה אחת קיימת בסימולציה
//     const totalActions = phases.reduce((sum, p) => sum + p.actions.length, 0);
//     if (totalActions === 0) {
//       toast("Please add at least one Data Reader or Data Writer to your execution plan.", "error");
//       return;
//     }

//     setSaving(true);
//     try {
//       // הכנת האובייקט לפי המבנה שמצפה לו ה-API
//       const payload = {
//         name: scenarioName,
//         description: `Custom simulation created on ${new Date().toLocaleDateString()}`,
//         scenario_config: {
//           transport_latency_ms: latency,
//           transport_jitter_ms: jitter,
//           phases: phases.map(p => ({
//             name: p.name.toLowerCase(),
//             actions: p.actions.map(a => ({
//               type: a.type === 'Writer' ? 'send_messages' : 'read_messages',
//               params: {
//                 count: a.messageCount,
//                 frequency: a.frequency
//               }
//             }))
//           })),
//           assertions: Object.entries(assertions)
//             .filter(([_, enabled]) => enabled)
//             .map(([key]) => ({
//               type: key === 'deliveryComplete' ? 'delivery_complete' : key === 'noErrors' ? 'no_errors' : 'all_matched',
//               scope: 'all'
//             }))
//         }
//       };

//       // שליחה לפונקציית ה-API (שומר כרגע בזיכרון של ה-Mock)
//       await createScenario(payload);
      
//       toast("Scenario saved successfully!", "success");
      
//       // מעבר חזרה לדף הקודם לאחר חצי שנייה כדי שהמשתמש יראה את ה-Toast
//       setTimeout(() => {
//         navigate(-1);
//       }, 800);
      
//     } catch (err) {
//       toast("Failed to save scenario. Please try again.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-8 font-heebo text-left" dir="ltr">
//       {/* כותרת עליונה */}
//       <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold text-navy-950 uppercase tracking-tight">NEW SIMULATION</h1>
//         </div>
//         <button 
//           onClick={handleSave}
//           disabled={saving}
//           className="relative z-50 flex items-center gap-2 bg-[#141e52] text-white px-6 py-2.5 rounded-[6px] font-bold text-[12px] tracking-wide hover:bg-navy-900 transition-all shadow-sm disabled:opacity-50"
//         >
//           <Save size={18} /> {saving ? 'SAVING...' : 'SAVE SCENARIO'}
//         </button>
//       </div>

//       <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
//         {/* הגדרות מרכזיות */}
//         <div className="col-span-8 space-y-6">
          
//           {/* General Information */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <Settings size={16} className="text-slate-400" />
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">General Information</h2>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[12px] font-bold text-navy-950">Scenario Name (Required)</label>
//               <input 
//                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] focus:border-navy-950 text-navy-950 outline-none transition-all placeholder:text-slate-300 font-medium"
//                 placeholder="Enter scenario identifier..."
//                 value={scenarioName}
//                 onChange={(e) => setScenarioName(e.target.value)}
//               />
//             </div>
//           </section>

//           {/* Execution Plan */}
//           <section className="bg-white rounded-[6px] border border-slate-200 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100 bg-white">
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Execution Plan</h2>
//             </div>
            
//             <div className="p-6 space-y-10">
//               {phases.map((phase) => (
//                 <div key={phase.id} className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-[11px] font-black text-blue-500 tracking-wider">
//                       PHASE {phase.id}: <span className="ml-2 text-navy-950 font-black">{phase.name}</span>
//                     </h3>
                    
//                     <div className="flex gap-2">
//                       <button 
//                         onClick={() => addAction(phase.id, 'Writer')}
//                         className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-orange-300 text-orange-600 bg-white hover:bg-orange-50/30 transition-all uppercase tracking-wider"
//                       >
//                         + Data Writer
//                       </button>
                      
//                       <button 
//                         onClick={() => addAction(phase.id, 'Reader')}
//                         className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-emerald-300 text-emerald-600 bg-white hover:bg-emerald-50/30 transition-all uppercase tracking-wider"
//                       >
//                         + Data Reader
//                       </button>
//                     </div>
//                   </div>

//                   {/* אזור פעולות */}
//                   <div className="min-h-[100px] border border-dashed border-slate-200 rounded-[6px] flex items-center justify-center p-4 bg-slate-50/20">
//                     {phase.actions.length === 0 ? (
//                       <span className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">No Actions Configured</span>
//                     ) : (
//                       <div className="w-full space-y-3">
//                         {phase.actions.map(action => (
//                           <div key={action.id} className="flex items-center justify-between p-4 bg-white rounded-[6px] border border-slate-200 relative group transition-all hover:shadow-sm">
//                             <div className="flex items-center gap-3">
//                               {action.type === 'Writer' ? (
//                                 <Radio size={15} className="text-orange-500" />
//                               ) : (
//                                 <Database size={15} className="text-emerald-500" />
//                               )}
//                               <span className="text-xs font-black text-navy-950 uppercase">
//                                 {action.type === 'Writer' ? 'DataWriter' : 'DataReader'}
//                               </span>
//                             </div>
//                             <div className="flex gap-6 text-[11px] font-bold text-slate-400">
//                               <span className="uppercase">Msg: <span className="text-navy-950">{action.messageCount}</span></span>
//                               <span className="uppercase">Freq: <span className="text-navy-950">{action.frequency}Hz</span></span>
//                             </div>
//                             <button 
//                               onClick={() => removeAction(phase.id, action.id)} 
//                               className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 bg-white border border-slate-200 p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-all"
//                             >
//                               <Trash2 size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* עמודת הגדרות רשת ו-Assertions */}
//         <div className="col-span-4 space-y-6">
//           {/* Network Emulation */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase mb-6">Network Emulation</h2>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
//                   <Clock size={14} className="text-slate-400" /> Latency (ms)
//                 </label>
//                 <input 
//                   type="number" 
//                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
//                   value={latency} 
//                   onChange={e => setLatency(Number(e.target.value))} 
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
//                   <Activity size={14} className="text-slate-400" /> Jitter (ms)
//                 </label>
//                 <input 
//                   type="number" 
//                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
//                   value={jitter} 
//                   onChange={e => setJitter(Number(e.target.value))} 
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Assertions */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <ShieldCheck size={16} className="text-slate-400" />
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Assertions</h2>
//             </div>
//             <div className="space-y-2">
//               {[
//                 { label: 'DELIVERY COMPLETE', key: 'deliveryComplete' },
//                 { label: 'NO ERRORS', key: 'noErrors' },
//                 { label: 'ALL MATCHED', key: 'allMatched' }
//               ].map(item => (
//                 <div key={item.key} className="flex items-center justify-between p-3.5 rounded-[6px] border border-slate-100 bg-slate-50/50">
//                   <span className="text-[10px] font-black tracking-wider text-navy-950">{item.label}</span>
//                   <input 
//                     type="checkbox" 
//                     checked={assertions[item.key as keyof typeof assertions]}
//                     onChange={(e) => setAssertions(prev => ({ ...prev, [item.key]: e.target.checked }))}
//                     className="w-4 h-4 rounded border-slate-300 text-[#141e52] focus:ring-0 focus:ring-offset-0 cursor-pointer" 
//                   />
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default NewSimulation;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ChevronLeft, Save, Clock, ShieldCheck, Activity, Settings, Database, Radio, Trash2 } from 'lucide-react';
// import { useToast } from '../components/Toast';
// import { createScenario, listScenarios } from '../api'; // ייבוא הפונקציות הנדרשות

// interface Action {
//   id: number;
//   type: 'Reader' | 'Writer';
//   messageCount: number;
//   frequency: number;
// }

// interface Phase {
//   id: number;
//   name: string;
//   actions: Action[];
// }

// const NewSimulation: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>(); // שליפת ה-ID מהכתובת במידה ואנחנו בעריכה
//   const { toast } = useToast();
  
//   const isEditMode = !!id; // האם אנחנו במצב עריכה?

//   const [scenarioName, setScenarioName] = useState("");
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);
//   const [saving, setSaving] = useState(false);
  
//   const [assertions, setAssertions] = useState({
//     deliveryComplete: false,
//     noErrors: false,
//     allMatched: false,
//   });

//   const [phases, setPhases] = useState<Phase[]>([
//     { id: 1, name: "SETUP", actions: [] as Action[] },
//     { id: 2, name: "TEST EXECUTION", actions: [] as Action[] }
//   ]);

//   // אפקט לטעינת נתוני הסימולציה הקיימת במידה ואנחנו במצב עריכה
//   // useEffect(() => {
//   //   if (isEditMode) {
//   //     const loadScenarioData = async () => {
//   //       try {
//   //         const scenarios = await listScenarios();
//   //         // const scenario = scenarios.find(s => s.id === id);
//   //         const scenario = scenarios.find(s => String(s.id) === String(id));
          
//   //         if (scenario) {
//   //           setScenarioName(scenario.name);
            
//   //           const config = scenario.scenario_config;
//   //           if (config) {
//   //             setLatency(config.transport_latency_ms || 0);
//   //             setJitter(config.transport_jitter_ms || 0);
              
//   //             // שחזור ה-phases וה-actions מהקונפיגורציה
//   //             if (config.phases) {
//   //               const loadedPhases = config.phases.map((p: any, idx: number) => ({
//   //                 id: idx + 1,
//   //                 name: p.name.toUpperCase(),
//   //                 actions: (p.actions || []).map((a: any, aIdx: number) => ({
//   //                   id: Date.now() + aIdx + idx * 100,
//   //                   type: a.type === 'send_messages' ? 'Writer' : 'Reader',
//   //                   messageCount: a.params?.count || 10,
//   //                   frequency: a.params?.frequency || 1
//   //                 }))
//   //               }));
                
//   //               // וודאי שיש לנו תמיד את שני ה-Phases הבסיסיים לפחות
//   //               if (loadedPhases.length < 2) {
//   //                 if (loadedPhases.length === 0) {
//   //                   setPhases([
//   //                     { id: 1, name: "SETUP", actions: [] },
//   //                     { id: 2, name: "TEST EXECUTION", actions: [] }
//   //                   ]);
//   //                 } else {
//   //                   setPhases([
//   //                     loadedPhases[0],
//   //                     { id: 2, name: "TEST EXECUTION", actions: [] }
//   //                   ]);
//   //                 }
//   //               } else {
//   //                 setPhases(loadedPhases);
//   //               }
//   //             }

//   //             // שחזור ה-Assertions
//   //             if (config.assertions) {
//   //               const types = config.assertions.map((ass: any) => ass.type);
//   //               setAssertions({
//   //                 deliveryComplete: types.includes('delivery_complete'),
//   //                 noErrors: types.includes('no_errors'),
//   //                 allMatched: types.includes('all_matched')
//   //               });
//   //             }
//   //           }
//   //         }
//   //       } catch (err) {
//   //         console.error("Failed to load scenario details:", err);
//   //         toast("Failed to load scenario data.", "error");
//   //       }
//   //     };

//   //     loadScenarioData();
//   //   }
//   // }, [id, isEditMode]);
//   // אפקט לטעינת נתוני הסימולציה הקיימת במידה ואנחנו במצב עריכה
//   useEffect(() => {
//     if (isEditMode) {
//       const loadScenarioData = async () => {
//         try {
//           const scenarios = await listScenarios();
          
//           // הדפסת דיבאג פשוטה ל-Console כדי לראות מה קורה מאחורי הקלעים
//           console.log("Searching for ID from URL:", id);
//           console.log("Available scenarios from API:", scenarios.map(s => ({ id: s.id, name: s.name })));

//           // השוואה בטוחה - מנקים רווחים וממירים לטקסט
//           const scenario = scenarios.find(s => {
//             if (!s.id || !id) return false;
//             return String(s.id).trim() === String(id).trim();
//           });
          
//           if (scenario) {
//             setScenarioName(scenario.name);
            
//             const config = scenario.scenario_config;
//             if (config) {
//               setLatency(config.transport_latency_ms || 0);
//               setJitter(config.transport_jitter_ms || 0);
              
//               // שחזור ה-phases וה-actions מהקונפיגורציה
//               // if (config.phases) {
//               //   const loadedPhases = config.phases.map((p: any, idx: number) => ({
//               //     id: idx + 1,
//               //     name: p.name.toUpperCase(),
//               //     actions: (p.actions || []).map((a: any, aIdx: number) => ({
//               //       id: Date.now() + aIdx + idx * 100,
//               //       type: a.type === 'send_messages' ? 'Writer' : 'Reader',
//               //       messageCount: a.params?.count || 10,
//               //       frequency: a.params?.frequency || 1
//               //     }))
//               //   }));
                
//               //   // וודאי שיש לנו תמיד את שני ה-Phases הבסיסיים לפחות
//               //   if (loadedPhases.length < 2) {
//               //     if (loadedPhases.length === 0) {
//               //       setPhases([
//               //         { id: 1, name: "SETUP", actions: [] },
//               //         { id: 2, name: "TEST EXECUTION", actions: [] }
//               //       ]);
//               //     } else {
//               //       setPhases([
//               //         loadedPhases[0],
//               //         { id: 2, name: "TEST EXECUTION", actions: [] }
//               //       ]);
//               //     }
//               //   } else {
//               //     setPhases(loadedPhases);
//               //   }
//               // }
// // שחזור ה-phases וה-actions מהקונפיגורציה בצורה בטוחה לחלוטין

//               if (config && Array.isArray(config.phases)) {
//                 const loadedPhases = config.phases.map((p: any, idx: number) => {
//                   // חילוץ שם השלב בבטחה - אם אין שם או שהוא undefined, נשתמש בברירת מחדל
//                   let phaseName = idx === 0 ? "SETUP" : "TEST EXECUTION";
//                   if (p && typeof p === 'object' && p.name) {
//                     phaseName = String(p.name).toUpperCase();
//                   }

//                   // חילוץ הפעולות (actions) בבטחה
//                   const originalActions = (p && Array.isArray(p.actions)) ? p.actions : [];
//                   const loadedActions = originalActions.map((a: any, aIdx: number) => {
//                     const actionType = a && a.type === 'send_messages' ? 'Writer' : 'Reader';
//                     const messageCount = a && a.params ? (a.params.count || 10) : 10;
//                     const frequency = a && a.params ? (a.params.frequency || 1) : 1;

//                     return {
//                       id: Date.now() + aIdx + idx * 100,
//                       type: actionType,
//                       messageCount: messageCount,
//                       frequency: frequency
//                     };
//                   });

//                   return {
//                     id: idx + 1,
//                     name: phaseName,
//                     actions: loadedActions
//                   };
//                 });

//                 // עדכון ה-State של השלבים
//                 if (loadedPhases.length === 0) {
//                   setPhases([
//                     { id: 1, name: "SETUP", actions: [] },
//                     { id: 2, name: "TEST EXECUTION", actions: [] }
//                   ]);
//                 } else {
//                   setPhases(loadedPhases);
//                 }
//               } else {
//                 // אם אין בכלל phases בקונפיגורציה, נטען את ברירת המחדל הריקה
//                 setPhases([
//                   { id: 1, name: "SETUP", actions: [] },
//                   { id: 2, name: "TEST EXECUTION", actions: [] }
//                 ]);
//               }

//               // שחזור ה-Assertions
//               if (config.assertions) {
//                 const types = config.assertions.map((ass: any) => ass.type);
//                 setAssertions({
//                   deliveryComplete: types.includes('delivery_complete'),
//                   noErrors: types.includes('no_errors'),
//                   allMatched: types.includes('all_matched')
//                 });
//               }
//             }
//           } else {
//             // אם לא נמצאה סימולציה תואמת, נדפיס אזהרה ללוג במקום לקרוס
//             console.warn(`Simulation with ID ${id} was not found in the scenarios list.`);
//             toast("Simulation not found. Starting with empty template.", "error");
//           }
//         } catch (err) {
//           console.error("Failed to load scenario details:", err);
//           toast("Failed to load scenario data.", "error");
//         }
//       };

//       loadScenarioData();
//     }
//   }, [id, isEditMode]);

//   const addAction = (phaseId: number, type: 'Reader' | 'Writer') => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { 
//           ...p, 
//           actions: [
//             ...p.actions, 
//             { id: Date.now(), type, messageCount: 10, frequency: 1 }
//           ] 
//         };
//       }
//       return p;
//     }));
//   };

//   const removeAction = (phaseId: number, actionId: number) => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { ...p, actions: p.actions.filter(a => a.id !== actionId) };
//       }
//       return p;
//     }));
//   };

//   // עדכון ערכים של פעולה ישירות מה-UI
//   const updateActionParams = (phaseId: number, actionId: number, field: 'messageCount' | 'frequency', value: number) => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return {
//           ...p,
//           actions: p.actions.map(a => a.id === actionId ? { ...a, [field]: value } : a)
//         };
//       }
//       return p;
//     }));
//   };

//   const handleSave = async () => {
//     if (!scenarioName.trim()) {
//       toast("Scenario name is required!", "error");
//       return;
//     }

//     const totalActions = phases.reduce((sum, p) => sum + p.actions.length, 0);
//     if (totalActions === 0) {
//       toast("Please add at least one Data Reader or Data Writer to your execution plan.", "error");
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         id: id, // שומר על ה-ID המקורי אם אנחנו בעריכה, כדי שה-API יעדכן במקום ליצור חדש
//         name: scenarioName,
//         description: isEditMode ? `Updated simulation` : `Custom simulation created on ${new Date().toLocaleDateString()}`,
//         scenario_config: {
//           transport_latency_ms: latency,
//           transport_jitter_ms: jitter,
//           phases: phases.map(p => ({
//             name: p.name.toLowerCase(),
//             actions: p.actions.map(a => ({
//               type: a.type === 'Writer' ? 'send_messages' : 'read_messages',
//               params: {
//                 count: a.messageCount,
//                 frequency: a.frequency
//               }
//             }))
//           })),
//           assertions: Object.entries(assertions)
//             .filter(([_, enabled]) => enabled)
//             .map(([key]) => ({
//               type: key === 'deliveryComplete' ? 'delivery_complete' : key === 'noErrors' ? 'no_errors' : 'all_matched',
//               scope: 'all'
//             }))
//         }
//       };

//       await createScenario(payload);
      
//       toast(isEditMode ? "Scenario updated successfully!" : "Scenario saved successfully!", "success");
      
//       setTimeout(() => {
//         navigate(-1);
//       }, 800);
      
//     } catch (err) {
//       toast("Failed to save scenario. Please try again.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-8 font-heebo text-left" dir="ltr">
//       {/* כותרת עליונה */}
//       <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold text-navy-950 uppercase tracking-tight">
//             {isEditMode ? 'EDIT SIMULATION' : 'NEW SIMULATION'}
//           </h1>
//         </div>
//         <button 
//           onClick={handleSave}
//           disabled={saving}
//           className="flex items-center gap-2 bg-[#141e52] text-white px-6 py-2.5 rounded-[6px] font-bold text-[12px] tracking-wide hover:bg-navy-900 transition-all shadow-sm disabled:opacity-50"
//         >
//           <Save size={18} /> {saving ? 'SAVING...' : isEditMode ? 'SAVE CHANGES' : 'SAVE SCENARIO'}
//         </button>
//       </div>

//       <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
//         {/* הגדרות מרכזיות */}
//         <div className="col-span-8 space-y-6">
          
//           {/* General Information */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <Settings size={16} className="text-slate-400" />
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">General Information</h2>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[12px] font-bold text-navy-950">Scenario Name (Required)</label>
//               <input 
//                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] focus:border-navy-950 text-navy-950 outline-none transition-all placeholder:text-slate-300 font-medium"
//                 placeholder="Enter scenario identifier..."
//                 value={scenarioName}
//                 onChange={(e) => setScenarioName(e.target.value)}
//               />
//             </div>
//           </section>

//           {/* Execution Plan */}
//           <section className="bg-white rounded-[6px] border border-slate-200 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100 bg-white">
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Execution Plan</h2>
//             </div>
            
//             <div className="p-6 space-y-10">
//               {phases.map((phase) => (
//                 <div key={phase.id} className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-[11px] font-black text-blue-500 tracking-wider">
//                       PHASE {phase.id}: <span className="ml-2 text-navy-950 font-black">{phase.name}</span>
//                     </h3>
                    
//                     <div className="flex gap-2">
//                       <button 
//                         onClick={() => addAction(phase.id, 'Writer')}
//                         className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-orange-300 text-orange-600 bg-white hover:bg-orange-50/30 transition-all uppercase tracking-wider"
//                       >
//                         + Data Writer
//                       </button>
                      
//                       <button 
//                         onClick={() => addAction(phase.id, 'Reader')}
//                         className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-emerald-300 text-emerald-600 bg-white hover:bg-emerald-50/30 transition-all uppercase tracking-wider"
//                       >
//                         + Data Reader
//                       </button>
//                     </div>
//                   </div>

//                   {/* אזור פעולות */}
//                   <div className="min-h-[100px] border border-dashed border-slate-200 rounded-[6px] flex items-center justify-center p-4 bg-slate-50/20">
//                     {phase.actions.length === 0 ? (
//                       <span className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">No Actions Configured</span>
//                     ) : (
//                       <div className="w-full space-y-3">
//                         {phase.actions.map(action => (
//                           <div key={action.id} className="flex items-center justify-between p-4 bg-white rounded-[6px] border border-slate-200 relative group transition-all hover:shadow-sm">
//                             <div className="flex items-center gap-3">
//                               {action.type === 'Writer' ? (
//                                 <Radio size={15} className="text-orange-500" />
//                               ) : (
//                                 <Database size={15} className="text-emerald-500" />
//                               )}
//                               <span className="text-xs font-black text-navy-950 uppercase">
//                                 {action.type === 'Writer' ? 'DataWriter' : 'DataReader'}
//                               </span>
//                             </div>
                            
//                             {/* שדות קלט דינמיים לעריכה */}
//                             <div className="flex gap-4 text-[11px] font-bold text-slate-400 items-center">
//                               <span className="flex items-center gap-1 uppercase">
//                                 Msg: 
//                                 <input 
//                                   type="number" 
//                                   value={action.messageCount}
//                                   onChange={(e) => updateActionParams(phase.id, action.id, 'messageCount', Number(e.target.value))}
//                                   className="w-12 px-1 py-0.5 border border-slate-200 rounded text-center text-navy-950 font-bold"
//                                 />
//                               </span>
//                               <span className="flex items-center gap-1 uppercase">
//                                 Freq: 
//                                 <input 
//                                   type="number" 
//                                   value={action.frequency}
//                                   onChange={(e) => updateActionParams(phase.id, action.id, 'frequency', Number(e.target.value))}
//                                   className="w-12 px-1 py-0.5 border border-slate-200 rounded text-center text-navy-950 font-bold"
//                                 /> Hz
//                               </span>
//                             </div>

//                             <button 
//                               onClick={() => removeAction(phase.id, action.id)} 
//                               className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 bg-white border border-slate-200 p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-all"
//                             >
//                               <Trash2 size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* עמודת הגדרות רשת ו-Assertions */}
//         <div className="col-span-4 space-y-6">
//           {/* Network Emulation */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase mb-6">Network Emulation</h2>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
//                   <Clock size={14} className="text-slate-400" /> Latency (ms)
//                 </label>
//                 <input 
//                   type="number" 
//                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
//                   value={latency} 
//                   onChange={e => setLatency(Number(e.target.value))} 
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
//                   <Activity size={14} className="text-slate-400" /> Jitter (ms)
//                 </label>
//                 <input 
//                   type="number" 
//                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
//                   value={jitter} 
//                   onChange={e => setJitter(Number(e.target.value))} 
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Assertions */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <ShieldCheck size={16} className="text-slate-400" />
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Assertions</h2>
//             </div>
//             <div className="space-y-2">
//               {[
//                 { label: 'DELIVERY COMPLETE', key: 'deliveryComplete' },
//                 { label: 'NO ERRORS', key: 'noErrors' },
//                 { label: 'ALL MATCHED', key: 'allMatched' }
//               ].map(item => (
//                 <div key={item.key} className="flex items-center justify-between p-3.5 rounded-[6px] border border-slate-100 bg-slate-50/50">
//                   <span className="text-[10px] font-black tracking-wider text-navy-950">{item.label}</span>
//                   <input 
//                     type="checkbox" 
//                     checked={assertions[item.key as keyof typeof assertions]}
//                     onChange={(e) => setAssertions(prev => ({ ...prev, [item.key]: e.target.checked }))}
//                     className="w-4 h-4 rounded border-slate-300 text-[#141e52] focus:ring-0 focus:ring-offset-0 cursor-pointer" 
//                   />
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default NewSimulation;