// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   ChevronLeft, Save, ArrowLeftRight,
//   Monitor, Radio, Database,
// } from 'lucide-react';
// import { useToast } from '../components/Toast';

// // API Imports
// import { createSimulation, updateSimulation, getSimulationById, getAllSimulations } from '../api/simulations';
// import { getAllSystems } from '../api/systems';
// import { getAllContracts } from '../api/contracts';
// import { getAbcVersionsByContract } from '../api/abcVersions'; 

// // Type Imports
// import type { System, Contract, DataReader, DataWriter } from '../types/api';


// interface ActiveSystem {
//   id: string;
//   selectedSystemId: string;
//   selectedContractId: string;
//   selectedAbcVersion: string;
//   data_readers: DataReader[]; 
//   data_writers: DataWriter[]; 
// }

// const cleanSuffixOfSystemNames = (suffixText: string, systemsList: any[]) => {
//   let cleaned = suffixText;
//   systemsList.forEach(sys => {
//     if (!sys.name) return;
//     const regexWithBrackets = new RegExp(`\\(${sys.name}\\)`, 'gi');
//     const regexPlain = new RegExp(sys.name, 'gi');
//     cleaned = cleaned.replace(regexWithBrackets, '').replace(regexPlain, '');
//   });
//   return cleaned.replace(/[\(\)\-\s]+/g, ' ').trim();
// };

// const NewSimulation = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { id } = useParams();

//   const isEditMode = !!id;
//   const simulationId = id;

//   const [generatedBaseName, setGeneratedBaseName] = useState('');
//   const [customSuffix, setCustomSuffix] = useState('');
  
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);
//   const [saving, setSaving] = useState(false);
  
//   const [availableSystems, setAvailableSystems] = useState<System[]>([]);
//   const [allContracts, setAllContracts] = useState<Contract[]>([]);
  
//   // שמירת גרסאות ה-ABC הזמינות לפי מזהה התיבה (Box ID) לצורך הצגה ב-UI בלבד
//   const [abcVersionsByBox, setAbcVersionsByBox] = useState<Record<string, any[]>>({ '1': [], '2': [] });

//   const [activeSystems, setActiveSystems] = useState<ActiveSystem[]>([
//     { id: '1', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', data_readers: [], data_writers: [] },
//     { id: '2', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', data_readers: [], data_writers: [] },
//   ]);

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const [systems, contracts] = await Promise.all([
//           getAllSystems(),
//           getAllContracts(),
//         ]);
//         setAvailableSystems(systems || []);
//         setAllContracts(contracts || []);

//         if (isEditMode && simulationId) {
//           const editSimulation = await getSimulationById(simulationId);
//           const fullName = editSimulation.simulation_name || '';
          
//           const config = editSimulation.systems as any;
//           if (config) {
//             setLatency(config.latency_ms ?? 0);
//             setJitter(config.jitter_ms ?? 0);

//             const savedSystemsArray = config.systems || [];
//             const versionsMap: Record<string, any[]> = {};

//             const populatedSystems = await Promise.all(
//               savedSystemsArray.map(async (savedSys: any, index: number) => {
//                 const currentContract = savedSys.contracts?.[0] || savedSys.contract?.[0] || savedSys.contract;
//                 const cId = currentContract?.contract_config_id;
//                 let fetchedAbcVersions: any[] = [];
//                 const boxId = String(index + 1);

//                 if (cId) {
//                   try {
//                     fetchedAbcVersions = await getAbcVersionsByContract(cId).catch(() => []);
//                   } catch (e) {
//                     console.error("Error loading sub-resources in edit mode", e);
//                   }
//                 }
                
//                 versionsMap[boxId] = fetchedAbcVersions;

//                 const data_writers = (currentContract?.data_writers || []).map((w: any) => ({ ...w, type: 'writer' as const }));
//                 const data_readers = (currentContract?.data_readers || []).map((r: any) => ({ ...r, type: 'reader' as const }));

//                 return {
//                   id: boxId,
//                   selectedSystemId: savedSys.system_id || '',
//                   selectedContractId: cId || '',
//                   selectedAbcVersion: savedSys.abc_version_id || '',
//                   data_readers,
//                   data_writers
//                 };
//               })
//             );

//             setAbcVersionsByBox(versionsMap);
//             setActiveSystems([
//               populatedSystems[0] || { id: '1', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', data_readers: [], data_writers: [] },
//               populatedSystems[1] || { id: '2', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', data_readers: [], data_writers: [] }
//             ]);

//             const name1 = systems.find(s => s.system_id === populatedSystems[0]?.selectedSystemId)?.name || '';
//             const name2 = systems.find(s => s.system_id === populatedSystems[1]?.selectedSystemId)?.name || '';
            
//             if (name1 || name2) {
//               const base = `(${name1 || '?'})-(${name2 || '?'})`;
//               setGeneratedBaseName(base);
              
//               if (fullName.startsWith(base)) {
//                 setCustomSuffix(fullName.replace(base, '').trim());
//               } else {
//                 setCustomSuffix(cleanSuffixOfSystemNames(fullName, systems));
//               }
//             } else {
//               setCustomSuffix(fullName);
//             }
//           }
//         }
//       } catch (err) {
//         console.error(err);
//         toast('Failed to load initial data', 'error');
//       }
//     };

//     loadInitialData();
//   }, [simulationId, isEditMode]);

//   const updateSystem = (boxId: string, systemId: string) => {
//     setActiveSystems(prev => {
//       const updatedSystems = prev.map(s => 
//         s.id === boxId ? { 
//           ...s, 
//           selectedSystemId: systemId, 
//           selectedContractId: '', 
//           selectedAbcVersion: '', 
//           data_readers: [], 
//           data_writers: [] 
//         } : s
//       );

//       const sys1Obj = updatedSystems.find(s => s.id === '1');
//       const sys2Obj = updatedSystems.find(s => s.id === '2');

//       const name1 = availableSystems.find(s => s.system_id === sys1Obj?.selectedSystemId)?.name || '';
//       const name2 = availableSystems.find(s => s.system_id === sys2Obj?.selectedSystemId)?.name || '';

//       if (name1 || name2) {
//         setGeneratedBaseName(`(${name1 || '?'})-(${name2 || '?'})`);
//       } else {
//         setGeneratedBaseName('');
//       }

//       setCustomSuffix(prevSuffix => cleanSuffixOfSystemNames(prevSuffix, availableSystems));

//       return updatedSystems;
//     });

//     setAbcVersionsByBox(prev => ({ ...prev, [boxId]: [] }));
//   };

//   const handleContractChange = async (boxId: string, contractId: string) => {
//     if (!contractId) {
//       setActiveSystems(prev => prev.map(s => 
//         s.id === boxId ? { ...s, selectedContractId: '', selectedAbcVersion: '', data_readers: [], data_writers: [] } : s
//       ));
//       setAbcVersionsByBox(prev => ({ ...prev, [boxId]: [] }));
//       return;
//     }

//     const selectedContractObj = allContracts.find(c => c.contract_config_id === contractId);
    
//     const data_writers = (selectedContractObj?.data_writers || []).map(w => ({ ...w, type: 'writer' as const }));
//     const data_readers = (selectedContractObj?.data_readers || []).map(r => ({ ...r, type: 'reader' as const }));

//     setActiveSystems(prev => prev.map(s => 
//       s.id === boxId ? { 
//         ...s, 
//         selectedContractId: contractId, 
//         selectedAbcVersion: '',
//         data_writers, 
//         data_readers
//       } : s
//     ));

//     try {
//       const abcVersionsList = await getAbcVersionsByContract(contractId).catch(() => []);
//       setAbcVersionsByBox(prev => ({ 
//         ...prev, 
//         [boxId]: abcVersionsList || [] 
//       }));
//     } catch (err) {
//       console.error("Error in handleContractChange:", err);
//       toast('Error loading components from database', 'error');
//     }
//   };

//   const handleAbcVersionChange = (boxId: string, abcVersionId: string) => {
//     setActiveSystems(prev => prev.map(s => s.id === boxId ? { ...s, selectedAbcVersion: abcVersionId } : s));
//   };

//   const handleEntityParamChange = (
//     boxId: string, 
//     entityId: string, 
//     type: 'writer' | 'reader', 
//     field: 'message_count' | 'message_frequency_hz', 
//     value: number
//   ) => {
//     setActiveSystems(prev => prev.map(sys => {
//       if (sys.id !== boxId) return sys;
      
//       if (type === 'writer') {
//         const updatedWriters = sys.data_writers.map(w => 
//           w.data_writer_id === entityId ? { ...w, [field]: value } : w
//         );
//         return { ...sys, data_writers: updatedWriters };
//       } else {
//         const updatedReaders = sys.data_readers.map(r => 
//           r.data_reader_id === entityId ? { ...r, [field]: value } : r
//         );
//         return { ...sys, data_readers: updatedReaders };
//       }
//     }));
//   };

//   const handleSave = async () => {
//     const finalScenarioName = `${generatedBaseName}${customSuffix}`.trim();

//     if (!finalScenarioName || generatedBaseName === '(?)-(?)') {
//       return toast('Simulation Name is required. Please select systems.', 'error');
//     }

//     const sys1 = activeSystems.find(s => s.id === '1');
//     const sys2 = activeSystems.find(s => s.id === '2');
//     if (sys1 && sys2 && sys1.selectedSystemId && sys1.selectedSystemId === sys2.selectedSystemId) {
//       return toast('System 1 and System 2 cannot be the same system', 'error');
//     }

//     for (let i = 0; i < activeSystems.length; i++) {
//       const sys = activeSystems[i];
//       const systemNameLabel = `System ${i + 1}`;

//       if (!sys.selectedSystemId) {
//         return toast(`Please select a configuration for ${systemNameLabel}`, 'error');
//       }
//       if (!sys.selectedContractId) {
//         return toast(`Please select a contract for ${systemNameLabel}`, 'error');
//       }
//       if (!sys.selectedAbcVersion) {
//         return toast(`Please select an ABC Protocol Version for ${systemNameLabel}`, 'error');
//       }
      
//       const totalEntitiesCount = (sys.data_writers?.length || 0) + (sys.data_readers?.length || 0);
//       if (totalEntitiesCount === 0) {
//         return toast(`No entities found for ${systemNameLabel}. Cannot save an empty topology`, 'error');
//       }

//       // וולידציה ל-Writers
//       for (let j = 0; j < sys.data_writers.length; j++) {
//         const entity = sys.data_writers[j];
//         const entityName = entity.name || `Writer #${j + 1}`;
//         if (entity.message_count === undefined || entity.message_count === null || entity.message_count <= 0) {
//           return toast(`MSG Count for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
//         }
//         if (entity.message_frequency_hz === undefined || entity.message_frequency_hz === null || entity.message_frequency_hz <= 0) {
//           return toast(`Freq (Hz) for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
//         }
//       }

//       // וולידציה ל-Readers
//       for (let j = 0; j < sys.data_readers.length; j++) {
//         const entity = sys.data_readers[j];
//         const entityName = entity.name || `Reader #${j + 1}`;
//         if (entity.message_count === undefined || entity.message_count === null || entity.message_count <= 0) {
//           return toast(`MSG Count for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
//         }
//         if (entity.message_frequency_hz === undefined || entity.message_frequency_hz === null || entity.message_frequency_hz <= 0) {
//           return toast(`Freq (Hz) for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
//         }
//       }
//     }

//     setSaving(true);

//     try {
//       const allSimulations = await getAllSimulations();
//       const nameExists = allSimulations.some((sim: any) => 
//         sim.simulation_name?.toLowerCase() === finalScenarioName.toLowerCase() && sim.simulation_config_id !== simulationId
//       );

//       if (nameExists) {
//         setSaving(false);
//         return toast(`The simulation name "${finalScenarioName}" already exists. Please choose a different suffix.`, 'error');
//       }

//       const payload = {
//         simulation_name: finalScenarioName, 
//         configuration_details: {
//           latency_ms: latency,
//           jitter_ms: jitter,
//           systems: activeSystems.map(s => {
//             const originalSystem = availableSystems.find(sys => sys.system_id === s.selectedSystemId);
//             const baseContract = allContracts.find(c => c.contract_config_id === s.selectedContractId);

//             const data_writers = s.data_writers.map(w => ({
//               data_writer_id: w.data_writer_id,
//               contract_config_id: s.selectedContractId,
//               name: w.name,
//               message_count: w.message_count ?? 0,
//               message_frequency_hz: w.message_frequency_hz ?? 0
//             }));

//             const data_readers = s.data_readers.map(r => ({
//               data_reader_id: r.data_reader_id,
//               contract_config_id: s.selectedContractId,
//               name: r.name,
//               message_count: r.message_count ?? 0,
//               message_frequency_hz: r.message_frequency_hz ?? 0
//             }));
             
//             return {
//               ...originalSystem,
//               system_id: s.selectedSystemId,
//               abc_version_id: s.selectedAbcVersion,
//               contracts: [
//                 {
//                   ...baseContract,
//                   contract_config_id: s.selectedContractId,
//                   data_writers,
//                   data_readers
//                 }
//               ]
//             };
//           })
//         }
//       };

//       if (isEditMode && simulationId) {
//         await updateSimulation(simulationId, payload as any);
//         toast('Simulation updated successfully!', 'success');
//       } else {
//         await createSimulation(payload as any);
//         toast('Simulation created successfully!', 'success');
//       }
      
//       navigate('/simulations');
//     } catch (err) {
//       console.error("Error saving simulation:", err);
//       toast('Failed to save simulation', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-left" dir="ltr">
      
//       {/* Top Bar */}
//       <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-lg md:text-xl font-black text-[#141E52] uppercase tracking-wide">
//             {isEditMode ? 'EDIT SIMULATION' : 'NEW SIMULATION'}
//           </h1>
//         </div>
//         <button 
//           onClick={handleSave} 
//           disabled={saving} 
//           className="w-full sm:w-auto cursor-pointer bg-[#274D96] hover:bg-[#37A8D8] text-white px-8 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-50"
//         >
//           <Save size={14} /> {saving ? 'SAVING...' : isEditMode ? 'UPDATE SIMULATION' : 'SAVE SIMULATION'}
//         </button>
//       </div>

//       {/* Grid Content */}
//       <main className="max-w-[1400px] mx-auto grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        
//         {/* Left side */}
//         <div className="lg:col-span-9 space-y-6">
          
//           {/* Simulation Name Section with Suffix input */}
//           <section className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-sm">
//             <label className="text-[11px] font-black text-[#141E52] block mb-2 uppercase tracking-wider">Simulation Name</label>
//             <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-[#141E52] transition-all">
              
//               {generatedBaseName && (
//                 <span className="bg-slate-50 text-slate-500 font-mono px-4 py-3 border-r border-slate-200 text-sm font-bold select-none">
//                   {generatedBaseName}
//                 </span>
//               )}
              
//               <input 
//                 type="text"
//                 className="w-full px-4 py-3 outline-none text-slate-800 font-semibold text-sm"
//                 value={customSuffix}
//                 onChange={(e) => setCustomSuffix(e.target.value)}
//                 placeholder={generatedBaseName ? "Add custom suffix (e.g. _v1, _run2)..." : "Select systems to generate base name..."}
//               />
//             </div>
//           </section>

//           {/* Topology Section */}
//           <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
//               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Topology</h2>
//             </div>

//             <div className="p-4 md:p-8 flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-8">
//               {activeSystems.map((sys, idx) => {
//                 const systemContracts = allContracts.filter(c => c.system_id === sys.selectedSystemId);
                
//                 // איחוד וירטואלי לצורך רינדור אחיד במסך
//                 const combinedEntities = [
//                   ...(sys.data_writers || []),
//                   ...(sys.data_readers || [])
//                 ];

//                 return (
//                   <div key={sys.id} className="w-full xl:w-auto flex flex-col xl:flex-row items-center gap-6 xl:gap-8">
                    
//                     <div className="w-full md:max-w-md xl:w-[360px] bg-white border border-slate-200 p-5 rounded-[20px] shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
//                       <div className="flex items-center gap-2 text-[#141E52] font-black text-[11px] uppercase tracking-wider">
//                         <Monitor size={14} className="text-[#274D96]" /> System {idx + 1} *
//                       </div>

//                       {/* Dropdown 1: Systems */}
//                       <select
//                         value={sys.selectedSystemId}
//                         onChange={(e) => updateSystem(sys.id, e.target.value)}
//                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs outline-none focus:border-[#141E52] transition-colors cursor-pointer"
//                       >
//                         <option value="">-- Choose System * --</option>
//                         {availableSystems.map(s => (
//                           <option key={s.system_id} value={s.system_id}>{s.name}</option>
//                         ))}
//                       </select>

//                       {sys.selectedSystemId && (
//                         <div className="pt-4 border-t border-slate-100 space-y-4">
                          
//                           {/* Dropdown 2: contract */}
//                           <label className="text-[10px] font-black text-[#274D96] uppercase block tracking-wider">1. Select Contract *</label>
//                           <select
//                             value={sys.selectedContractId}
//                             onChange={(e) => handleContractChange(sys.id, e.target.value)}
//                             className="w-full p-3 bg-white border border-[#274D96]/20 rounded-lg font-bold text-xs outline-none focus:border-[#274D96] transition-colors cursor-pointer"
//                           >
//                             <option value="">-- Select Contract * --</option>
//                             {systemContracts.map(c => (
//                               <option key={c.contract_config_id} value={c.contract_config_id}>
//                                 {c.name} {c.version ? `(v${c.version})` : ''}
//                               </option>
//                             ))}
//                           </select>

//                           {/* Dropdown 3: ABC protocol */}
//                           {sys.selectedContractId && (
//                             <>
//                               <label className="text-[10px] font-black text-[#37A8D8] uppercase block tracking-wider">2. ABC Protocol Version *</label>
//                               <select
//                                 value={sys.selectedAbcVersion}
//                                 onChange={(e) => handleAbcVersionChange(sys.id, e.target.value)}
//                                 className="w-full p-3 bg-white border border-[#37A8D8]/20 rounded-lg font-bold text-xs outline-none focus:border-[#37A8D8] transition-colors cursor-pointer"
//                               >
//                                 <option value="">-- Select ABC Version * --</option>
//                                 {(abcVersionsByBox[sys.id] || []).map(v => (
//                                   <option key={v.abc_version_id} value={v.abc_version_id}>
//                                     {v.abc_version_name || 'Unknown Version'}
//                                   </option>
//                                 ))}
//                               </select>
//                             </>
//                           )}

//                           {/* Entity List View */}
//                           {sys.selectedContractId && (
//                             <div className="pt-4 border-t border-slate-100 mt-2">
//                               <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-wider">Entities *</label>
                              
//                               {combinedEntities.length > 0 ? (
//                                 <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
//                                   {combinedEntities.map((entity, eIdx) => {
//                                     const isWriter = 'data_writer_id' in entity;
//                                     const entityId = isWriter ? entity.data_writer_id : entity.data_reader_id;
                                    
//                                     return (
//                                       <div key={eIdx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col gap-3 hover:shadow-sm transition-all">
//                                         <div className="flex items-center gap-2">
//                                           {isWriter ? (
//                                             <Radio size={14} className="text-[#D65527]" />
//                                           ) : (
//                                             <Database size={14} className="text-[#59660F]" />
//                                           )}
//                                           <span className="text-[11px] font-bold uppercase text-[#141E52] truncate">
//                                             {entity.name || 'Unnamed'}
//                                           </span>
//                                           <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ml-auto uppercase ${isWriter ? 'bg-orange-50 text-[#D65527]' : 'bg-emerald-50 text-[#59660F]'}`}>
//                                             {isWriter ? 'Writer' : 'Reader'}
//                                           </span>
//                                         </div>
                                        
//                                         <div className="grid grid-cols-2 gap-2 border-t border-slate-200/60 pt-2">
//                                           <div className="space-y-1">
//                                             <label className="text-[9px] font-bold text-slate-400 uppercase block">MSG Count *</label>
//                                             <input 
//                                               type="number" 
//                                               min="1"
//                                               className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-[#141E52]"
//                                               value={entity.message_count ?? ''}
//                                               onChange={(e) => handleEntityParamChange(sys.id, entityId, isWriter ? 'writer' : 'reader', 'message_count', Number(e.target.value))}
//                                             />
//                                           </div>
//                                           <div className="space-y-1">
//                                             <label className="text-[9px] font-bold text-slate-400 uppercase block">Freq (Hz) *</label>
//                                             <input 
//                                               type="number" 
//                                               min="1"
//                                               className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-[#141E52]"
//                                               value={entity.message_frequency_hz ?? ''}
//                                               onChange={(e) => handleEntityParamChange(sys.id, entityId, isWriter ? 'writer' : 'reader', 'message_frequency_hz', Number(e.target.value))}
//                                             />
//                                           </div>
//                                         </div>
//                                       </div>
//                                     );
//                                   })}
//                                 </div>
//                               ) : (
//                                 <div className="text-[11px] text-slate-400 italic text-center py-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
//                                   No components found or loading...
//                                 </div>
//                               )}
//                             </div>
//                           )}

//                         </div>
//                       )}
//                     </div>
                    
//                     {idx === 0 && <ArrowLeftRight size={20} className="text-slate-300 transform rotate-90 xl:rotate-0 my-2 xl:my-0" />}
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         </div>

//         {/* Right side Channel Parameters */}
//         <div className="lg:col-span-3 w-full">
//           <section className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-sm">
//             <h2 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Channel Params</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
//               <div className="space-y-1">
//                 <label className="text-[11px] font-bold text-[#141E52]">Latency (ms)</label>
//                 <input type="number" min="0" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none focus:border-[#141E52] font-semibold text-slate-700" value={latency} onChange={e => setLatency(Number(e.target.value))} />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[11px] font-bold text-[#141E52]">Jitter (ms)</label>
//                 <input type="number" min="0" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none focus:border-[#141E52] font-semibold text-slate-700" value={jitter} onChange={e => setJitter(Number(e.target.value))} />
//               </div>
//             </div>
//           </section>
//         </div>

//       </main>
//     </div>
//   );
// };

// export default NewSimulation;

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft, Save, ArrowLeftRight,
  Monitor, Radio, Database,
} from 'lucide-react';
import { useToast } from '../components/Toast';

// API Imports
import { createSimulation, updateSimulation, getSimulationById, getAllSimulations } from '../api/simulations';
import { getAllSystems } from '../api/systems';
import { getAllContracts } from '../api/contracts';
import { getAbcVersionsByContract } from '../api/abcVersions'; 

// Type Imports
import type { System, Contract, DataReader, DataWriter } from '../types/api';

interface ActiveSystem {
  id: string;
  selectedSystemId: string;
  selectedContractId: string;
  selectedAbcVersion: string;
  data_readers: DataReader[]; 
  data_writers: DataWriter[]; 
}

const cleanSuffixOfSystemNames = (suffixText: string, systemsList: any[]) => {
  let cleaned = suffixText;
  systemsList.forEach(sys => {
    if (!sys.name) return;
    const regexWithBrackets = new RegExp(`\\(${sys.name}\\)`, 'gi');
    const regexPlain = new RegExp(sys.name, 'gi');
    cleaned = cleaned.replace(regexWithBrackets, '').replace(regexPlain, '');
  });
  return cleaned.replace(/[\(\)\-\s]+/g, ' ').trim();
};

const NewSimulation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const isEditMode = !!id;
  const simulationId = id;

  const [generatedBaseName, setGeneratedBaseName] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  
  const [saving, setSaving] = useState(false);
  
  const [availableSystems, setAvailableSystems] = useState<System[]>([]);
  const [allContracts, setAllContracts] = useState<Contract[]>([]);
  
  const [abcVersionsByBox, setAbcVersionsByBox] = useState<Record<string, any[]>>({ '1': [], '2': [] });

  const [activeSystems, setActiveSystems] = useState<ActiveSystem[]>([
    { id: '1', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', data_readers: [], data_writers: [] },
    { id: '2', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', data_readers: [], data_writers: [] },
  ]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [systems, contracts] = await Promise.all([
          getAllSystems(),
          getAllContracts(),
        ]);
        setAvailableSystems(systems || []);
        setAllContracts(contracts || []);

        if (isEditMode && simulationId) {
          const editSimulation = await getSimulationById(simulationId);
          const fullName = editSimulation.simulation_name || '';
          
          const savedSystemsArray = editSimulation.systems || [];
          const versionsMap: Record<string, any[]> = {};

          const populatedSystems = await Promise.all(
            savedSystemsArray.map(async (savedSys: any, index: number) => {
              const currentContract = savedSys.contracts?.[0] || savedSys.contract?.[0] || savedSys.contract;
              const cId = currentContract?.contract_config_id;
              let fetchedAbcVersions: any[] = [];
              const boxId = String(index + 1);

              if (cId) {
                try {
                  fetchedAbcVersions = await getAbcVersionsByContract(cId).catch(() => []);
                } catch (e) {
                  console.error("Error loading sub-resources in edit mode", e);
                }
              }
              
              versionsMap[boxId] = fetchedAbcVersions;

              const data_writers = (currentContract?.data_writers || []).map((w: any) => ({ ...w, type: 'writer' as const }));
              const data_readers = (currentContract?.data_readers || []).map((r: any) => ({ ...r, type: 'reader' as const }));

              return {
                id: boxId,
                selectedSystemId: savedSys.system_id || '',
                selectedContractId: cId || '',
                selectedAbcVersion: savedSys.abc_version_id || '',
                data_readers,
                data_writers
              };
            })
          );

          setAbcVersionsByBox(versionsMap);
          setActiveSystems([
            populatedSystems[0] || { id: '1', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', data_readers: [], data_writers: [] },
            populatedSystems[1] || { id: '2', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', data_readers: [], data_writers: [] }
          ]);

          const name1 = systems.find(s => s.system_id === populatedSystems[0]?.selectedSystemId)?.name || '';
          const name2 = systems.find(s => s.system_id === populatedSystems[1]?.selectedSystemId)?.name || '';
          
          if (name1 || name2) {
            const base = `(${name1 || '?'})-(${name2 || '?'})`;
            setGeneratedBaseName(base);
            
            if (fullName.startsWith(base)) {
              setCustomSuffix(fullName.replace(base, '').trim());
            } else {
              setCustomSuffix(cleanSuffixOfSystemNames(fullName, systems));
            }
          } else {
            setCustomSuffix(fullName);
          }
        }
      } catch (err) {
        console.error(err);
        toast('Failed to load initial data', 'error');
      }
    };

    loadInitialData();
  }, [simulationId, isEditMode]);

  const updateSystem = (boxId: string, systemId: string) => {
    setActiveSystems(prev => {
      const updatedSystems = prev.map(s => 
        s.id === boxId ? { 
          ...s, 
          selectedSystemId: systemId, 
          selectedContractId: '', 
          selectedAbcVersion: '', 
          data_readers: [], 
          data_writers: [] 
        } : s
      );

      const sys1Obj = updatedSystems.find(s => s.id === '1');
      const sys2Obj = updatedSystems.find(s => s.id === '2');

      const name1 = availableSystems.find(s => s.system_id === sys1Obj?.selectedSystemId)?.name || '';
      const name2 = availableSystems.find(s => s.system_id === sys2Obj?.selectedSystemId)?.name || '';

      if (name1 || name2) {
        setGeneratedBaseName(`(${name1 || '?'})-(${name2 || '?'})`);
      } else {
        setGeneratedBaseName('');
      }

      setCustomSuffix(prevSuffix => cleanSuffixOfSystemNames(prevSuffix, availableSystems));

      return updatedSystems;
    });

    setAbcVersionsByBox(prev => ({ ...prev, [boxId]: [] }));
  };

  const handleContractChange = async (boxId: string, contractId: string) => {
    if (!contractId) {
      setActiveSystems(prev => prev.map(s => 
        s.id === boxId ? { ...s, selectedContractId: '', selectedAbcVersion: '', data_readers: [], data_writers: [] } : s
      ));
      setAbcVersionsByBox(prev => ({ ...prev, [boxId]: [] }));
      return;
    }

    const selectedContractObj = allContracts.find(c => c.contract_config_id === contractId);
    
    const data_writers = (selectedContractObj?.data_writers || []).map(w => ({ ...w, type: 'writer' as const }));
    const data_readers = (selectedContractObj?.data_readers || []).map(r => ({ ...r, type: 'reader' as const }));

    setActiveSystems(prev => prev.map(s => 
      s.id === boxId ? { 
        ...s, 
        selectedContractId: contractId, 
        selectedAbcVersion: '',
        data_writers, 
        data_readers
      } : s
    ));

    try {
      const abcVersionsList = await getAbcVersionsByContract(contractId).catch(() => []);
      setAbcVersionsByBox(prev => ({ 
        ...prev, 
        [boxId]: abcVersionsList || [] 
      }));
    } catch (err) {
      console.error("Error in handleContractChange:", err);
      toast('Error loading components from database', 'error');
    }
  };

  const handleAbcVersionChange = (boxId: string, abcVersionId: string) => {
    setActiveSystems(prev => prev.map(s => s.id === boxId ? { ...s, selectedAbcVersion: abcVersionId } : s));
  };

  const handleEntityParamChange = (
    boxId: string, 
    entityId: string, 
    type: 'writer' | 'reader', 
    field: 'message_count' | 'message_frequency_hz', 
    value: number
  ) => {
    setActiveSystems(prev => prev.map(sys => {
      if (sys.id !== boxId) return sys;
      
      if (type === 'writer') {
        const updatedWriters = sys.data_writers.map(w => 
          w.data_writer_id === entityId ? { ...w, [field]: value } : w
        );
        return { ...sys, data_writers: updatedWriters };
      } else {
        const updatedReaders = sys.data_readers.map(r => 
          r.data_reader_id === entityId ? { ...r, [field]: value } : r
        );
        return { ...sys, data_readers: updatedReaders };
      }
    }));
  };

  const handleSave = async () => {
    const finalScenarioName = `${generatedBaseName}${customSuffix}`.trim();

    if (!finalScenarioName || generatedBaseName === '(?)-(?)') {
      return toast('Simulation Name is required. Please select systems.', 'error');
    }

    const sys1 = activeSystems.find(s => s.id === '1');
    const sys2 = activeSystems.find(s => s.id === '2');
    if (sys1 && sys2 && sys1.selectedSystemId && sys1.selectedSystemId === sys2.selectedSystemId) {
      return toast('System 1 and System 2 cannot be the same system', 'error');
    }

    for (let i = 0; i < activeSystems.length; i++) {
      const sys = activeSystems[i];
      const systemNameLabel = `System ${i + 1}`;

      if (!sys.selectedSystemId) {
        return toast(`Please select a configuration for ${systemNameLabel}`, 'error');
      }
      if (!sys.selectedContractId) {
        return toast(`Please select a contract for ${systemNameLabel}`, 'error');
      }
      if (!sys.selectedAbcVersion) {
        return toast(`Please select an ABC Protocol Version for ${systemNameLabel}`, 'error');
      }
      
      const totalEntitiesCount = (sys.data_writers?.length || 0) + (sys.data_readers?.length || 0);
      if (totalEntitiesCount === 0) {
        return toast(`No entities found for ${systemNameLabel}. Cannot save an empty topology`, 'error');
      }

      // Writer Validation
      for (let j = 0; j < sys.data_writers.length; j++) {
        const entity = sys.data_writers[j];
        const entityName = entity.name || `Writer #${j + 1}`;
        if (entity.message_count === undefined || entity.message_count === null || entity.message_count <= 0) {
          return toast(`MSG Count for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
        }
        if (entity.message_frequency_hz === undefined || entity.message_frequency_hz === null || entity.message_frequency_hz <= 0) {
          return toast(`Freq (Hz) for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
        }
      }

      // Reader Validation
      for (let j = 0; j < sys.data_readers.length; j++) {
        const entity = sys.data_readers[j];
        const entityName = entity.name || `Reader #${j + 1}`;
        if (entity.message_count === undefined || entity.message_count === null || entity.message_count <= 0) {
          return toast(`MSG Count for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
        }
        if (entity.message_frequency_hz === undefined || entity.message_frequency_hz === null || entity.message_frequency_hz <= 0) {
          return toast(`Freq (Hz) for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
        }
      }
    }

    setSaving(true);

    try {
      const allSimulations = await getAllSimulations();
      const nameExists = allSimulations.some((sim: any) => 
        sim.simulation_name?.toLowerCase() === finalScenarioName.toLowerCase() && sim.simulation_config_id !== simulationId
      );

      if (nameExists) {
        setSaving(false);
        return toast(`The simulation name "${finalScenarioName}" already exists. Please choose a different suffix.`, 'error');
      }

      // בניית הפיילואד בדיוק לפי האינטרפייס החדש (שטוח - systems בחוץ)
      const payload = {
        simulation_name: finalScenarioName, 
        systems: activeSystems.map(s => {
          const originalSystem = availableSystems.find(sys => sys.system_id === s.selectedSystemId);
          const baseContract = allContracts.find(c => c.contract_config_id === s.selectedContractId);

          const data_writers = s.data_writers.map(w => ({
            data_writer_id: w.data_writer_id,
            contract_config_id: s.selectedContractId,
            name: w.name,
            message_count: w.message_count ?? 0,
            message_frequency_hz: w.message_frequency_hz ?? 0
          }));

          const data_readers = s.data_readers.map(r => ({
            data_reader_id: r.data_reader_id,
            contract_config_id: s.selectedContractId,
            name: r.name,
            message_count: r.message_count ?? 0,
            message_frequency_hz: r.message_frequency_hz ?? 0
          }));
             
          return {
            ...originalSystem,
            system_id: s.selectedSystemId,
            abc_version_id: s.selectedAbcVersion,
            contracts: [
              {
                ...baseContract,
                contract_config_id: s.selectedContractId,
                data_writers,
                data_readers
              }
            ]
          };
        })
      };

      if (isEditMode && simulationId) {
        await updateSimulation(simulationId, payload as any);
        toast('Simulation updated successfully!', 'success');
      } else {
        await createSimulation(payload as any);
        toast('Simulation created successfully!', 'success');
      }
      
      navigate('/simulations');
    } catch (err) {
      console.error("Error saving simulation:", err);
      toast('Failed to save simulation', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-left" dir="ltr">
      
      {/* Top Bar */}
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg md:text-xl font-black text-[#141E52] uppercase tracking-wide">
            {isEditMode ? 'EDIT SIMULATION' : 'NEW SIMULATION'}
          </h1>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="w-full sm:w-auto cursor-pointer bg-[#274D96] hover:bg-[#37A8D8] text-white px-8 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-50"
        >
          <Save size={14} /> {saving ? 'SAVING...' : isEditMode ? 'UPDATE SIMULATION' : 'SAVE SIMULATION'}
        </button>
      </div>

      {/* Grid Content - Full width since Channel Params are removed */}
      <main className="max-w-[1400px] mx-auto space-y-6 items-start">
        
        {/* Simulation Name Section with Suffix input */}
        <section className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-sm">
          <label className="text-[11px] font-black text-[#141E52] block mb-2 uppercase tracking-wider">Simulation Name</label>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-[#141E52] transition-all">
            
            {generatedBaseName && (
              <span className="bg-slate-50 text-slate-500 font-mono px-4 py-3 border-r border-slate-200 text-sm font-bold select-none">
                {generatedBaseName}
              </span>
            )}
            
            <input 
              type="text"
              className="w-full px-4 py-3 outline-none text-slate-800 font-semibold text-sm"
              value={customSuffix}
              onChange={(e) => setCustomSuffix(e.target.value)}
              placeholder={generatedBaseName ? "Add custom suffix (e.g. _v1, _run2)..." : "Select systems to generate base name..."}
            />
          </div>
        </section>

        {/* Topology Section */}
        <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Topology</h2>
          </div>

          <div className="p-4 md:p-8 flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-8">
            {activeSystems.map((sys, idx) => {
              const systemContracts = allContracts.filter(c => c.system_id === sys.selectedSystemId);
              
              // איחוד וירטואלי לצורך רינדור אחיד במסך
              const combinedEntities = [
                ...(sys.data_writers || []),
                ...(sys.data_readers || [])
              ];

              return (
                <div key={sys.id} className="w-full xl:w-auto flex flex-col xl:flex-row items-center gap-6 xl:gap-8">
                  
                  <div className="w-full md:max-w-md xl:w-[360px] bg-white border border-slate-200 p-5 rounded-[20px] shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 text-[#141E52] font-black text-[11px] uppercase tracking-wider">
                      <Monitor size={14} className="text-[#274D96]" /> System {idx + 1} *
                    </div>

                    {/* Dropdown 1: Systems */}
                    <select
                      value={sys.selectedSystemId}
                      onChange={(e) => updateSystem(sys.id, e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs outline-none focus:border-[#141E52] transition-colors cursor-pointer"
                    >
                      <option value="">-- Choose System * --</option>
                      {availableSystems.map(s => (
                        <option key={s.system_id} value={s.system_id}>{s.name}</option>
                      ))}
                    </select>

                    {sys.selectedSystemId && (
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        
                        {/* Dropdown 2: contract */}
                        <label className="text-[10px] font-black text-[#274D96] uppercase block tracking-wider">1. Select Contract *</label>
                        <select
                          value={sys.selectedContractId}
                          onChange={(e) => handleContractChange(sys.id, e.target.value)}
                          className="w-full p-3 bg-white border border-[#274D96]/20 rounded-lg font-bold text-xs outline-none focus:border-[#274D96] transition-colors cursor-pointer"
                        >
                          <option value="">-- Select Contract * --</option>
                          {systemContracts.map(c => (
                            <option key={c.contract_config_id} value={c.contract_config_id}>
                              {c.name} {c.version ? `(v${c.version})` : ''}
                            </option>
                          ))}
                        </select>

                        {/* Dropdown 3: ABC protocol */}
                        {sys.selectedContractId && (
                          <>
                            <label className="text-[10px] font-black text-[#37A8D8] uppercase block tracking-wider">2. ABC Protocol Version *</label>
                            <select
                              value={sys.selectedAbcVersion}
                              onChange={(e) => handleAbcVersionChange(sys.id, e.target.value)}
                              className="w-full p-3 bg-white border border-[#37A8D8]/20 rounded-lg font-bold text-xs outline-none focus:border-[#37A8D8] transition-colors cursor-pointer"
                            >
                              <option value="">-- Select ABC Version * --</option>
                              {(abcVersionsByBox[sys.id] || []).map(v => (
                                <option key={v.abc_version_id} value={v.abc_version_id}>
                                  {v.abc_version_id || 'Unknown Version'}
                                </option>
                              ))}
                            </select>
                          </>
                        )}

                        {/* Entity List View */}
                        {sys.selectedContractId && (
                          <div className="pt-4 border-t border-slate-100 mt-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-wider">Entities *</label>
                            
                            {combinedEntities.length > 0 ? (
                              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                                {combinedEntities.map((entity, eIdx) => {
                                  const isWriter = 'data_writer_id' in entity;
                                  const entityId = isWriter ? entity.data_writer_id : entity.data_reader_id;
                                  
                                  return (
                                    <div key={eIdx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col gap-3 hover:shadow-sm transition-all">
                                      <div className="flex items-center gap-2">
                                        {isWriter ? (
                                          <Radio size={14} className="text-[#D65527]" />
                                        ) : (
                                          <Database size={14} className="text-[#59660F]" />
                                        )}
                                        <span className="text-[11px] font-bold uppercase text-[#141E52] truncate">
                                          {entity.name || 'Unnamed'}
                                        </span>
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ml-auto uppercase ${isWriter ? 'bg-orange-50 text-[#D65527]' : 'bg-emerald-50 text-[#59660F]'}`}>
                                          {isWriter ? 'Writer' : 'Reader'}
                                        </span>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-2 border-t border-slate-200/60 pt-2">
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-slate-400 uppercase block">MSG Count *</label>
                                          <input 
                                            type="number" 
                                            min="1"
                                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-[#141E52]"
                                            value={entity.message_count ?? ''}
                                            onChange={(e) => handleEntityParamChange(sys.id, entityId, isWriter ? 'writer' : 'reader', 'message_count', Number(e.target.value))}
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-slate-400 uppercase block">Freq (Hz) *</label>
                                          <input 
                                            type="number" 
                                            min="1"
                                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-[#141E52]"
                                            value={entity.message_frequency_hz ?? ''}
                                            onChange={(e) => handleEntityParamChange(sys.id, entityId, isWriter ? 'writer' : 'reader', 'message_frequency_hz', Number(e.target.value))}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-400 italic text-center py-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                No components found or loading...
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                  
                  {idx === 0 && <ArrowLeftRight size={20} className="text-slate-300 transform rotate-90 xl:rotate-0 my-2 xl:my-0" />}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default NewSimulation;


// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   ChevronLeft, Save, ArrowLeftRight,
//   Monitor, Radio, Database,
// } from 'lucide-react';
// import { useToast } from '../components/Toast';

// // API Imports
// import { createSimulation, updateSimulation, getSimulationById, getAllSimulations } from '../api/simulations';
// import { getAllSystems } from '../api/systems';
// import { getAllContracts } from '../api/contracts'; // 🌟 מחקנו את getContractEntities, אין בה צורך יותר
// import { getAbcVersionsByContract } from '../api/abcVersions'; 

// // Type Imports - 🌟 מעודכן לטיפוסים החדשים
// import type { System, Contract, DataReader, DataWriter, AbcVersion } from '../types/api';

// interface ActiveSystem {
//   id: string; 
//   selectedSystemId: string;
//   selectedContractId: string;      
//   selectedAbcVersion: string;      
//   availableAbcVersions: AbcVersion[]; 
//   data_readers: DataReader[]; // 🌟 פוצל לשני מערכים ייעודיים
//   data_writers: DataWriter[]; // 🌟 פוצל לשני מערכים ייעודיים
// }

// const cleanSuffixOfSystemNames = (suffixText: string, systemsList: any[]) => {
//   let cleaned = suffixText;
//   systemsList.forEach(sys => {
//     if (!sys.name) return;
//     const regexWithBrackets = new RegExp(`\\(${sys.name}\\)`, 'gi');
//     const regexPlain = new RegExp(sys.name, 'gi');
//     cleaned = cleaned.replace(regexWithBrackets, '').replace(regexPlain, '');
//   });
//   return cleaned.replace(/[\(\)\-\s]+/g, ' ').trim();
// };

// const NewSimulation = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { id } = useParams();

//   const isEditMode = !!id;
//   const simulationId = id;

//   const [generatedBaseName, setGeneratedBaseName] = useState('');
//   const [customSuffix, setCustomSuffix] = useState('');
  
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);
//   const [saving, setSaving] = useState(false);
  
//   const [availableSystems, setAvailableSystems] = useState<System[]>([]);
//   const [allContracts, setAllContracts] = useState<Contract[]>([]);
  
//   const [activeSystems, setActiveSystems] = useState<ActiveSystem[]>([
//     { id: '1', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', availableAbcVersions: [], data_readers: [], data_writers: [] },
//     { id: '2', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', availableAbcVersions: [], data_readers: [], data_writers: [] },
//   ]);

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const [systems, contracts] = await Promise.all([
//           getAllSystems(),
//           getAllContracts(),
//         ]);
//         setAvailableSystems(systems || []);
//         setAllContracts(contracts || []);

//         if (isEditMode && simulationId) {
//           const editSimulation = await getSimulationById(simulationId);
//           const fullName = editSimulation.simulation_name || '';
          
//           const config = editSimulation.configuration_details as any;
//           if (config) {
//             setLatency(config.latency_ms ?? 0);
//             setJitter(config.jitter_ms ?? 0);

//             const savedSystemsArray = config.systems || [];
//             const populatedSystems = await Promise.all(
//               savedSystemsArray.map(async (savedSys: any, index: number) => {
//                 const cId = savedSys.contract?.contract_config_id || savedSys.contract_config_id;
//                 let fetchedAbcVersions: AbcVersion[] = [];

//                 if (cId) {
//                   try {
//                     fetchedAbcVersions = await getAbcVersionsByContract(cId).catch(() => []);
//                   } catch (e) {
//                     console.error("Error loading sub-resources in edit mode", e);
//                   }
//                 }

//                 // מוצאים את החוזה המקורי מרשימת החוזים הכללית שנטענה
//                 const originalContract = contracts.find((c: any) => c.contract_config_id === cId);
                
//                 // מיזוג נתוני ה-Readers השמורים מול תבנית המילון העדכנית
//                 const savedReaders = savedSys.contract?.data_readers || [];
//                 const mergedReaders = (originalContract?.data_readers && originalContract.data_readers.length > 0)
//                   ? originalContract.data_readers.map((r: any) => {
//                       const saved = savedReaders.find((sr: any) => sr.data_reader_id === r.data_reader_id);
//                       return saved ? { ...r, message_count: saved.message_count, message_frequency_hz: saved.message_frequency_hz } : r;
//                     })
//                   : savedReaders;

//                 // מיזוג נתוני ה-Writers השמורים מול תבנית המילון העדכנית
//                 const savedWriters = savedSys.contract?.data_writers || [];
//                 const mergedWriters = (originalContract?.data_writers && originalContract.data_writers.length > 0)
//                   ? originalContract.data_writers.map((w: any) => {
//                       const saved = savedWriters.find((sw: any) => sw.data_writer_id === w.data_writer_id);
//                       return saved ? { ...w, message_count: saved.message_count, message_frequency_hz: saved.message_frequency_hz } : w;
//                     })
//                   : savedWriters;

//                 return {
//                   id: String(index + 1),
//                   selectedSystemId: savedSys.system_id || '',
//                   selectedContractId: cId || '',
//                   selectedAbcVersion: savedSys.abc_version_id || '',
//                   availableAbcVersions: fetchedAbcVersions,
//                   data_readers: mergedReaders,
//                   data_writers: mergedWriters
//                 };
//               })
//             );

//             setActiveSystems([
//               populatedSystems[0] || { id: '1', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', availableAbcVersions: [], data_readers: [], data_writers: [] },
//               populatedSystems[1] || { id: '2', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', availableAbcVersions: [], data_readers: [], data_writers: [] }
//             ]);

//             const name1 = systems.find(s => s.system_id === populatedSystems[0]?.selectedSystemId)?.name || '';
//             const name2 = systems.find(s => s.system_id === populatedSystems[1]?.selectedSystemId)?.name || '';
            
//             if (name1 || name2) {
//               const base = `(${name1 || '?'})-(${name2 || '?'})`;
//               setGeneratedBaseName(base);
              
//               if (fullName.startsWith(base)) {
//                 setCustomSuffix(fullName.replace(base, '').trim());
//               } else {
//                 setCustomSuffix(cleanSuffixOfSystemNames(fullName, systems));
//               }
//             } else {
//               setCustomSuffix(fullName);
//             }
//           }
//         }
//       } catch (err) {
//         console.error(err);
//         toast('Failed to load initial data', 'error');
//       }
//     };

//     loadInitialData();
//   }, [simulationId, isEditMode]);

//   const updateSystem = (boxId: string, systemId: string) => {
//     setActiveSystems(prev => {
//       const updatedSystems = prev.map(s => 
//         s.id === boxId ? { 
//           ...s, 
//           selectedSystemId: systemId, 
//           selectedContractId: '', 
//           selectedAbcVersion: '', 
//           availableAbcVersions: [], 
//           data_readers: [],
//           data_writers: [] 
//         } : s
//       );

//       const sys1Obj = updatedSystems.find(s => s.id === '1');
//       const sys2Obj = updatedSystems.find(s => s.id === '2');

//       const name1 = availableSystems.find(s => s.system_id === sys1Obj?.selectedSystemId)?.name || '';
//       const name2 = availableSystems.find(s => s.system_id === sys2Obj?.selectedSystemId)?.name || '';

//       if (name1 || name2) {
//         setGeneratedBaseName(`(${name1 || '?'})-(${name2 || '?'})`);
//       } else {
//         setGeneratedBaseName('');
//       }

//       setCustomSuffix(prevSuffix => cleanSuffixOfSystemNames(prevSuffix, availableSystems));

//       return updatedSystems;
//     });
//   };

//   const handleContractChange = async (boxId: string, contractId: string) => {
//     if (!contractId) {
//       setActiveSystems(prev => prev.map(s => 
//         s.id === boxId ? { ...s, selectedContractId: '', selectedAbcVersion: '', availableAbcVersions: [], data_readers: [], data_writers: [] } : s
//       ));
//       return;
//     }

//     // 🌟 שליפת המילון הנבחר ישירות מתוך רשימת החוזים שכבר קיימת לנו בסטייט - כולל ה-DR וה-DW שלו!
//     const selectedContractObj = allContracts.find(c => c.contract_config_id === contractId);

//     setActiveSystems(prev => prev.map(s => 
//       s.id === boxId ? { 
//         ...s, 
//         selectedContractId: contractId, 
//         data_readers: selectedContractObj?.data_readers || [], 
//         data_writers: selectedContractObj?.data_writers || [], 
//         availableAbcVersions: [] 
//       } : s
//     ));

//     try {
//       const abcVersionsList = await getAbcVersionsByContract(contractId).catch(() => []);
//       setActiveSystems(prev => prev.map(s => 
//         s.id === boxId ? { 
//           ...s, 
//           availableAbcVersions: abcVersionsList || []
//         } : s
//       ));
//     } catch (err) {
//       console.error("Error in handleContractChange:", err);
//       toast('Error loading protocol versions', 'error');
//     }
//   };

//   const handleAbcVersionChange = (boxId: string, abcVersionId: string) => {
//     setActiveSystems(prev => prev.map(s => s.id === boxId ? { ...s, selectedAbcVersion: abcVersionId } : s));
//   };

//   // 🌟 עדכון הפרמטרים מותאם כעת לעבודה עם סוג הישות (reader / writer) והמערך הנכון
//   const handleEntityParamChange = (
//     boxId: string, 
//     type: 'reader' | 'writer',
//     entityIndex: number, 
//     field: 'message_count' | 'message_frequency_hz', 
//     value: number
//   ) => {
//     setActiveSystems(prev => prev.map(sys => {
//       if (sys.id !== boxId) return sys;
      
//       if (type === 'reader') {
//         const updatedEntities = [...sys.data_readers];
//         updatedEntities[entityIndex] = { ...updatedEntities[entityIndex], [field]: value };
//         return { ...sys, data_readers: updatedEntities };
//       } else {
//         const updatedEntities = [...sys.data_writers];
//         updatedEntities[entityIndex] = { ...updatedEntities[entityIndex], [field]: value };
//         return { ...sys, data_writers: updatedEntities };
//       }
//     }));
//   };

//   const handleSave = async () => {
//     const finalScenarioName = `${generatedBaseName}${customSuffix}`.trim();

//     if (!finalScenarioName || generatedBaseName === '(?)-(?)') {
//       return toast('Simulation Name is required. Please select systems.', 'error');
//     }

//     const sys1 = activeSystems.find(s => s.id === '1');
//     const sys2 = activeSystems.find(s => s.id === '2');
//     if (sys1 && sys2 && sys1.selectedSystemId && sys1.selectedSystemId === sys2.selectedSystemId) {
//       return toast('System 1 and System 2 cannot be the same system', 'error');
//     }

//     for (let i = 0; i < activeSystems.length; i++) {
//       const sys = activeSystems[i];
//       const systemNameLabel = `System ${i + 1}`;

//       if (!sys.selectedSystemId) {
//         return toast(`Please select a configuration for ${systemNameLabel}`, 'error');
//       }
//       if (!sys.selectedContractId) {
//         return toast(`Please select a contract for ${systemNameLabel}`, 'error');
//       }
//       if (!sys.selectedAbcVersion) {
//         return toast(`Please select an ABC Protocol Version for ${systemNameLabel}`, 'error');
//       }
      
//       const hasReaders = sys.data_readers && sys.data_readers.length > 0;
//       const hasWriters = sys.data_writers && sys.data_writers.length > 0;
//       if (!hasReaders && !hasWriters) {
//         return toast(`No readers or writers found for ${systemNameLabel}. Cannot save an empty topology`, 'error');
//       }

//       // 🌟 ולידציה מופרדת ל-Data Readers
//       for (let j = 0; j < sys.data_readers.length; j++) {
//         const reader = sys.data_readers[j];
//         const entityName = reader.name || `Reader #${j + 1}`;

//         if (reader.message_count === undefined || reader.message_count === null || reader.message_count <= 0) {
//           return toast(`MSG Count for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
//         }
//         if (reader.message_frequency_hz === undefined || reader.message_frequency_hz === null || reader.message_frequency_hz <= 0) {
//           return toast(`Freq (Hz) for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
//         }
//       }

//       // 🌟 ולידציה מופרדת ל-Data Writers
//       for (let j = 0; j < sys.data_writers.length; j++) {
//         const writer = sys.data_writers[j];
//         const entityName = writer.name || `Writer #${j + 1}`;

//         if (writer.message_count === undefined || writer.message_count === null || writer.message_count <= 0) {
//           return toast(`MSG Count for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
//         }
//         if (writer.message_frequency_hz === undefined || writer.message_frequency_hz === null || writer.message_frequency_hz <= 0) {
//           return toast(`Freq (Hz) for "${entityName}" in ${systemNameLabel} must be greater than 0`, 'error');
//         }
//       }
//     }

//     setSaving(true);

//     try {
//       const allSimulations = await getAllSimulations();
//       const nameExists = allSimulations.some((sim: any) => 
//         sim.simulation_name?.toLowerCase() === finalScenarioName.toLowerCase() && sim.simulation_config_id !== simulationId
//       );

//       if (nameExists) {
//         setSaving(false);
//         return toast(`The simulation name "${finalScenarioName}" already exists. Please choose a different suffix.`, 'error');
//       }

//       // 🌟 בניית ה-Payload החדש וההיררכי בהתאם לדרישות החדשות
//       const payload = {
//         simulation_name: finalScenarioName, 
//         configuration_details: {
//           latency_ms: latency,
//           jitter_ms: jitter,
//           systems: activeSystems.map(s => {
//             const originalContract = allContracts.find(c => c.contract_config_id === s.selectedContractId);
//             return {
//               system_id: s.selectedSystemId,
//               abc_version_id: s.selectedAbcVersion,
//               contract: {
//                 contract_config_id: s.selectedContractId,
//                 system_id: s.selectedSystemId,
//                 name: originalContract?.name || '',
//                 version: originalContract?.version || '',
//                 data_readers: s.data_readers.map(r => ({
//                   data_reader_id: r.data_reader_id,
//                   contract_config_id: s.selectedContractId,
//                   name: r.name,
//                   message_count: r.message_count ?? 0,
//                   message_frequency_hz: r.message_frequency_hz ?? 0
//                 })),
//                 data_writers: s.data_writers.map(w => ({
//                   data_writer_id: w.data_writer_id,
//                   contract_config_id: s.selectedContractId,
//                   name: w.name,
//                   message_count: w.message_count ?? 0,
//                   message_frequency_hz: w.message_frequency_hz ?? 0
//                 }))
//               }
//             };
//           })
//         }
//       };

//       if (isEditMode && simulationId) {
//         await updateSimulation(simulationId, payload as any);
//         toast('Simulation updated successfully!', 'success');
//       } else {
//         await createSimulation(payload as any);
//         toast('Simulation created successfully!', 'success');
//       }
      
//       navigate('/simulations');
//     } catch (err) {
//       console.error("Error saving simulation:", err);
//       toast('Failed to save simulation', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-left" dir="ltr">
      
//       {/* Top Bar */}
//       <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-lg md:text-xl font-black text-[#141E52] uppercase tracking-wide">
//             {isEditMode ? 'EDIT SIMULATION' : 'NEW SIMULATION'}
//           </h1>
//         </div>
//         <button 
//           onClick={handleSave} 
//           disabled={saving} 
//           className="w-full sm:w-auto cursor-pointer bg-[#274D96] hover:bg-[#37A8D8] text-white px-8 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-50"
//         >
//           <Save size={14} /> {saving ? 'SAVING...' : isEditMode ? 'UPDATE SIMULATION' : 'SAVE SIMULATION'}
//         </button>
//       </div>

//       {/* Grid Content */}
//       <main className="max-w-[1400px] mx-auto grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        
//         {/* Left side */}
//         <div className="lg:col-span-9 space-y-6">
          
//           {/* Simulation Name Section with Suffix input */}
//           <section className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-sm">
//             <label className="text-[11px] font-black text-[#141E52] block mb-2 uppercase tracking-wider">Simulation Name</label>
//             <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-[#141E52] transition-all">
              
//               {generatedBaseName && (
//                 <span className="bg-slate-50 text-slate-500 font-mono px-4 py-3 border-r border-slate-200 text-sm font-bold select-none">
//                   {generatedBaseName}
//                 </span>
//               )}
              
//               <input 
//                 type="text"
//                 className="w-full px-4 py-3 outline-none text-slate-800 font-semibold text-sm"
//                 value={customSuffix}
//                 onChange={(e) => setCustomSuffix(e.target.value)}
//                 placeholder={generatedBaseName ? "Add custom suffix (e.g. _v1, _run2)..." : "Select systems to generate base name..."}
//               />
//             </div>
//           </section>

//           {/* Topology Section */}
//           <section className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
//               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Topology</h2>
//             </div>

//             <div className="p-4 md:p-8 flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-8">
//               {activeSystems.map((sys, idx) => {
//                 const systemContracts = allContracts.filter(c => c.system_id === sys.selectedSystemId);
//                 const hasEntities = (sys.data_readers && sys.data_readers.length > 0) || (sys.data_writers && sys.data_writers.length > 0);

//                 return (
//                   <div key={sys.id} className="w-full xl:w-auto flex flex-col xl:flex-row items-center gap-6 xl:gap-8">
                    
//                     <div className="w-full md:max-w-md xl:w-[360px] bg-white border border-slate-200 p-5 rounded-[20px] shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
//                       <div className="flex items-center gap-2 text-[#141E52] font-black text-[11px] uppercase tracking-wider">
//                         <Monitor size={14} className="text-[#274D96]" /> System {idx + 1} *
//                       </div>

//                       {/* Dropdown 1: Systems */}
//                       <select
//                         value={sys.selectedSystemId}
//                         onChange={(e) => updateSystem(sys.id, e.target.value)}
//                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs outline-none focus:border-[#141E52] transition-colors cursor-pointer"
//                       >
//                         <option value="">-- Choose System * --</option>
//                         {availableSystems.map(s => (
//                           <option key={s.system_id} value={s.system_id}>{s.name}</option>
//                         ))}
//                       </select>

//                       {sys.selectedSystemId && (
//                         <div className="pt-4 border-t border-slate-100 space-y-4">
                          
//                           {/* Dropdown 2: contract */}
//                           <label className="text-[10px] font-black text-[#274D96] uppercase block tracking-wider">1. Select Contract *</label>
//                           <select
//                             value={sys.selectedContractId}
//                             onChange={(e) => handleContractChange(sys.id, e.target.value)}
//                             className="w-full p-3 bg-white border border-[#274D96]/20 rounded-lg font-bold text-xs outline-none focus:border-[#274D96] transition-colors cursor-pointer"
//                           >
//                             <option value="">-- Select Contract * --</option>
//                             {systemContracts.map(c => (
//                               <option key={c.contract_config_id} value={c.contract_config_id}>
//                                 {c.name} {c.version ? `(v${c.version})` : ''}
//                               </option>
//                             ))}
//                           </select>

//                           {/* Dropdown 3: ABC protocol */}
//                           {sys.selectedContractId && (
//                             <>
//                               <label className="text-[10px] font-black text-[#37A8D8] uppercase block tracking-wider">2. ABC Protocol Version *</label>
//                               <select
//                                 value={sys.selectedAbcVersion}
//                                 onChange={(e) => handleAbcVersionChange(sys.id, e.target.value)}
//                                 className="w-full p-3 bg-white border border-[#37A8D8]/20 rounded-lg font-bold text-xs outline-none focus:border-[#37A8D8] transition-colors cursor-pointer"
//                               >
//                                 <option value="">-- Select ABC Version * --</option>
//                                 {sys.availableAbcVersions.map(v => (
//                                   <option key={v.abc_version_id} value={v.abc_version_id}>
//                                     {v.abc_version_name || 'Unknown Version'}
//                                   </option>
//                                 ))}
//                               </select>
//                             </>
//                           )}

//                           {/* 🌟 רינדור רשימת הישויות המפוצלת החדשה */}
//                           {sys.selectedContractId && (
//                             <div className="pt-4 border-t border-slate-100 mt-2">
//                               <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-wider">Entities *</label>
                              
//                               {hasEntities ? (
//                                 <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                                  
//                                   {/* 1. רינדור ה-Data Readers */}
//                                   {sys.data_readers?.map((reader, rIdx) => (
//                                     <div key={`r-${rIdx}`} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col gap-3 hover:shadow-sm transition-all">
//                                       <div className="flex items-center gap-2">
//                                         <Database size={14} className="text-[#59660F]" />
//                                         <span className="text-[11px] font-bold uppercase text-[#141E52] truncate">
//                                           {reader.name || 'Unnamed Reader'}
//                                         </span>
//                                         <span className="text-[8px] font-black px-1.5 py-0.5 rounded ml-auto uppercase bg-emerald-50 text-[#59660F]">
//                                           Reader
//                                         </span>
//                                       </div>
                                      
//                                       <div className="grid grid-cols-2 gap-2 border-t border-slate-200/60 pt-2">
//                                         <div className="space-y-1">
//                                           <label className="text-[9px] font-bold text-slate-400 uppercase block">MSG Count *</label>
//                                           <input 
//                                             type="number" 
//                                             min="1"
//                                             className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-[#141E52]"
//                                             value={reader.message_count ?? ''}
//                                             onChange={(e) => handleEntityParamChange(sys.id, 'reader', rIdx, 'message_count', Number(e.target.value))}
//                                           />
//                                         </div>
//                                         <div className="space-y-1">
//                                           <label className="text-[9px] font-bold text-slate-400 uppercase block">Freq (Hz) *</label>
//                                           <input 
//                                             type="number" 
//                                             min="1"
//                                             className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-[#141E52]"
//                                             value={reader.message_frequency_hz ?? ''}
//                                             onChange={(e) => handleEntityParamChange(sys.id, 'reader', rIdx, 'message_frequency_hz', Number(e.target.value))}
//                                           />
//                                         </div>
//                                       </div>
//                                     </div>
//                                   ))}

//                                   {/* 2. רינדור ה-Data Writers */}
//                                   {sys.data_writers?.map((writer, wIdx) => (
//                                     <div key={`w-${wIdx}`} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col gap-3 hover:shadow-sm transition-all">
//                                       <div className="flex items-center gap-2">
//                                         <Radio size={14} className="text-[#D65527]" />
//                                         <span className="text-[11px] font-bold uppercase text-[#141E52] truncate">
//                                           {writer.name || 'Unnamed Writer'}
//                                         </span>
//                                         <span className="text-[8px] font-black px-1.5 py-0.5 rounded ml-auto uppercase bg-orange-50 text-[#D65527]">
//                                           Writer
//                                         </span>
//                                       </div>
                                      
//                                       <div className="grid grid-cols-2 gap-2 border-t border-slate-200/60 pt-2">
//                                         <div className="space-y-1">
//                                           <label className="text-[9px] font-bold text-slate-400 uppercase block">MSG Count *</label>
//                                           <input 
//                                             type="number" 
//                                             min="1"
//                                             className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-[#141E52]"
//                                             value={writer.message_count ?? ''}
//                                             onChange={(e) => handleEntityParamChange(sys.id, 'writer', wIdx, 'message_count', Number(e.target.value))}
//                                           />
//                                         </div>
//                                         <div className="space-y-1">
//                                           <label className="text-[9px] font-bold text-slate-400 uppercase block">Freq (Hz) *</label>
//                                           <input 
//                                             type="number" 
//                                             min="1"
//                                             className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-[#141E52]"
//                                             value={writer.message_frequency_hz ?? ''}
//                                             onChange={(e) => handleEntityParamChange(sys.id, 'writer', wIdx, 'message_frequency_hz', Number(e.target.value))}
//                                           />
//                                         </div>
//                                       </div>
//                                     </div>
//                                   ))}

//                                 </div>
//                               ) : (
//                                 <div className="text-[11px] text-slate-400 italic text-center py-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
//                                   No components found or loading...
//                                 </div>
//                               )}
//                             </div>
//                           )}

//                         </div>
//                       )}
//                     </div>
                    
//                     {idx === 0 && <ArrowLeftRight size={20} className="text-slate-300 transform rotate-90 xl:rotate-0 my-2 xl:my-0" />}
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         </div>

//         {/* Right side Channel Parameters */}
//         <div className="lg:col-span-3 w-full">
//           <section className="bg-white rounded-[16px] border border-slate-100 p-5 shadow-sm">
//             <h2 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Channel Params</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
//               <div className="space-y-1">
//                 <label className="text-[11px] font-bold text-[#141E52]">Latency (ms)</label>
//                 <input type="number" min="0" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none focus:border-[#141E52] font-semibold text-slate-700" value={latency} onChange={e => setLatency(Number(e.target.value))} />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[11px] font-bold text-[#141E52]">Jitter (ms)</label>
//                 <input type="number" min="0" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none focus:border-[#141E52] font-semibold text-slate-700" value={jitter} onChange={e => setJitter(Number(e.target.value))} />
//               </div>
//             </div>
//           </section>
//         </div>

//       </main>
//     </div>
//   );
// };

// export default NewSimulation;