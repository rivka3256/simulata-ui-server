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
import { getAllContracts, getContractEntities } from '../api/contracts';
import { getAbcVersionsByContract } from '../api/abcVersions'; 

// Type Imports
import type { System, Contract, DataEntity, AbcVersion } from '../types/api';

interface ActiveSystem {
  id: string; 
  selectedSystemId: string;
  selectedContractId: string;      
  selectedAbcVersion: string;      
  availableAbcVersions: AbcVersion[]; 
  entities: DataEntity[];
}

// פונקציית עזר שמנקה שמות מערכות מהסיומת כדי להשאיר רק את ה-Suffix האמיתי
const cleanSuffixOfSystemNames = (suffixText: string, systemsList: any[]) => {
  let cleaned = suffixText;
  systemsList.forEach(sys => {
    if (!sys.name) return;
    // מנקה פורמטים כמו (System_Name) או System_Name
    const regexWithBrackets = new RegExp(`\\(${sys.name}\\)`, 'gi');
    const regexPlain = new RegExp(sys.name, 'gi');
    cleaned = cleaned.replace(regexWithBrackets, '').replace(regexPlain, '');
  });
  // מנקה מקפים, סוגריים ורווחים כפולים שנשארו כתוצאה מההחלפה
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
  
  const [latency, setLatency] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [saving, setSaving] = useState(false);
  
  const [availableSystems, setAvailableSystems] = useState<System[]>([]);
  const [allContracts, setAllContracts] = useState<Contract[]>([]);
  
  const [activeSystems, setActiveSystems] = useState<ActiveSystem[]>([
    { id: '1', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', availableAbcVersions: [], entities: [] },
    { id: '2', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', availableAbcVersions: [], entities: [] },
  ]);

  // הטעינה הראשונית עם תיקון המיזוג לעריכה והפרדת השם
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [systems, contracts] = await Promise.all([
          getAllSystems(),
          getAllContracts(),
        ]);
        setAvailableSystems(systems || []);
        setAllContracts(contracts || []);

        // טעינה במצב עריכה
        if (isEditMode && simulationId) {
          const editSimulation = await getSimulationById(simulationId);
          const fullName = editSimulation.simulation_name || '';
          
          const config = editSimulation.configuration_details as any;
          if (config) {
            setLatency(config.latency_ms ?? 0);
            setJitter(config.jitter_ms ?? 0);

            const savedSystemsArray = config.systems || [];
            const populatedSystems = await Promise.all(
              savedSystemsArray.map(async (savedSys: any, index: number) => {
                const cId = savedSys.contract_config_id;
                let fetchedEntities: DataEntity[] = [];
                let fetchedAbcVersions: AbcVersion[] = [];

                if (cId) {
                  try {
                    const [entitiesRes, abcRes] = await Promise.all([
                      getContractEntities(cId).catch(() => []),
                      getAbcVersionsByContract(cId).catch(() => [])
                    ]);
                    fetchedEntities = entitiesRes;
                    fetchedAbcVersions = abcRes;
                  } catch (e) {
                    console.error("Error loading sub-resources in edit mode", e);
                  }
                }

                // מיזוג הערכים השמורים לתוך הרכיבים שנטענו
                const mergedEntities = fetchedEntities.map((entity: any) => {
                  const currentEntityId = entity.entity_id || entity.data_writer_id || entity.data_reader_id;
                  
                  const savedEntity = (savedSys.entities || []).find((se: any) => 
                    (se.entity_id === currentEntityId || se.data_writer_id === currentEntityId || se.data_reader_id === currentEntityId)
                  );

                  if (savedEntity) {
                    return {
                      ...entity,
                      message_count: savedEntity.message_count ?? entity.message_count,
                      message_frequency_hz: savedEntity.message_frequency_hz ?? entity.message_frequency_hz
                    };
                  }
                  return entity;
                });

                return {
                  id: String(index + 1),
                  selectedSystemId: savedSys.system_id || '',
                  selectedContractId: cId || '',
                  selectedAbcVersion: savedSys.abc_version_id || '',
                  availableAbcVersions: fetchedAbcVersions,
                  entities: mergedEntities
                };
              })
            );

            setActiveSystems([
              populatedSystems[0] || { id: '1', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', availableAbcVersions: [], entities: [] },
              populatedSystems[1] || { id: '2', selectedSystemId: '', selectedContractId: '', selectedAbcVersion: '', availableAbcVersions: [], entities: [] }
            ]);

            // שחזור והפרדה חכמה של השם האוטומטי והסיומת
            const name1 = systems.find(s => s.system_id === populatedSystems[0]?.selectedSystemId)?.name || '';
            const name2 = systems.find(s => s.system_id === populatedSystems[1]?.selectedSystemId)?.name || '';
            
            if (name1 || name2) {
              const base = `(${name1 || '?'})-(${name2 || '?'})`;
              setGeneratedBaseName(base);
              
              // if (fullName.startsWith(base)) {
              //   setCustomSuffix(fullName.replace(base, ''));
              // } else {
              //   setCustomSuffix(fullName);
              // }
              if (fullName.startsWith(base)) {
  setCustomSuffix(fullName.replace(base, '').trim());
} else {
  // 🔥 שימוש בפונקציית הניקוי החדשה גם בטעינה הראשונית של עריכה
  setCustomSuffix(cleanSuffixOfSystemNames(fullName, systems));
}
            } else {
              setCustomSuffix(fullName);
            }
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
        availableAbcVersions: [], 
        entities: [] 
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

    // 🔥 התיקון המרכזי: ניקוי מיידי של האינפוט משמות המערכות הקודמות שהיו תקועים בו
    setCustomSuffix(prevSuffix => cleanSuffixOfSystemNames(prevSuffix, availableSystems));

    return updatedSystems;
  });
};

  const handleContractChange = async (boxId: string, contractId: string) => {
    if (!contractId) {
      setActiveSystems(prev => prev.map(s => 
        s.id === boxId ? { ...s, selectedContractId: '', selectedAbcVersion: '', availableAbcVersions: [], entities: [] } : s
      ));
      return;
    }

    setActiveSystems(prev => prev.map(s => 
      s.id === boxId ? { ...s, selectedContractId: contractId, entities: [], availableAbcVersions: [] } : s
    ));

    try {
      const [entitiesList, abcVersionsList] = await Promise.all([
        getContractEntities(contractId), 
        getAbcVersionsByContract(contractId).catch(() => [])
      ]);

      setActiveSystems(prev => prev.map(s => 
        s.id === boxId ? { 
          ...s, 
          selectedContractId: contractId,
          entities: entitiesList || [], 
          availableAbcVersions: abcVersionsList || []
        } : s
      ));

    } catch (err) {
      console.error("Error in handleContractChange:", err);
      toast('Error loading components from database', 'error');
    }
  };

  const handleAbcVersionChange = (boxId: string, abcVersionId: string) => {
    setActiveSystems(prev => prev.map(s => s.id === boxId ? { ...s, selectedAbcVersion: abcVersionId } : s));
  };

  const handleEntityParamChange = (boxId: string, entityIndex: number, field: 'message_count' | 'message_frequency_hz', value: number) => {
    setActiveSystems(prev => prev.map(sys => {
      if (sys.id !== boxId) return sys;
      const updatedEntities = [...sys.entities];
      updatedEntities[entityIndex] = {
        ...updatedEntities[entityIndex],
        [field]: value
      };
      return { ...sys, entities: updatedEntities };
    }));
  };


  const handleSave = async () => {
  // 1. יצירת השם הסופי בצורה מפורשת ומדויקת על בסיס הסטייט העדכני ביותר
  const finalScenarioName = `${generatedBaseName}${customSuffix}`.trim();

  // בדיקות תקינות
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
      return toast(`Please select a Dictionary for ${systemNameLabel}`, 'error');
    }
    if (!sys.selectedAbcVersion) {
      return toast(`Please select an ABC Protocol Version for ${systemNameLabel}`, 'error');
    }
    if (!sys.entities || sys.entities.length === 0) {
      return toast(`No entities found for ${systemNameLabel}. Cannot save an empty topology`, 'error');
    }

    for (let j = 0; j < sys.entities.length; j++) {
      const entity = sys.entities[j];
      const entityName = entity.name || `Entity #${j + 1}`;

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
    // בדיקה האם השם החדש כבר קיים (רק אם זה לא ה-ID הנוכחי שאנחנו עורכים)
    const allSimulations = await getAllSimulations();
    const nameExists = allSimulations.some((sim: any) => 
      sim.simulation_name?.toLowerCase() === finalScenarioName.toLowerCase() && sim.simulation_config_id !== simulationId
    );

    if (nameExists) {
      setSaving(false);
      return toast(`The simulation name "${finalScenarioName}" already exists. Please choose a different suffix.`, 'error');
    }

    // 2. בניית ה-Payload - שימי לב שערך ה-simulation_name מקבל בדיוק את finalScenarioName שחישבנו למעלה!
    const payload = {
      simulation_name: finalScenarioName, // השם החדש (למשל עם ה-B במקום ה-A)
      configuration_details: {
        latency_ms: latency,
        jitter_ms: jitter,
        systems: activeSystems.map(s => ({
          system_id: s.selectedSystemId,
          contract_config_id: s.selectedContractId,
          abc_version_id: s.selectedAbcVersion,
          entities: s.entities.map(e => ({
            entity_id: e.entity_id || e.data_writer_id || e.data_reader_id,
            name: e.name,
            type: e.type || (e.data_writer_id ? 'writer' : 'reader'),
            message_count: e.message_count ?? 0,
            message_frequency_hz: e.message_frequency_hz ?? 0
          }))
        }))
      }
    };

    // 3. שליחה לשרת ומעבר עמוד מיידי כדי לרענן את הנתונים
    if (isEditMode && simulationId) {
      await updateSimulation(simulationId, payload as any);
      toast('Simulation updated successfully!', 'success');
    } else {
      await createSimulation(payload as any);
      toast('Simulation created successfully!', 'success');
    }
    
    // ניווט חזרה לעמוד הסימולציות - שם הנתונים ייטענו מחדש מהשרת עם השם המעודכן
    navigate('/simulations');
  } catch (err) {
    console.error("Error saving simulation:", err);
    toast('Failed to save simulation', 'error');
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-heebo" dir="ltr">
      {/* Top Bar */}
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-navy-950 uppercase tracking-wide">
            {isEditMode ? 'EDIT SIMULATION' : 'NEW SIMULATION'}
          </h1>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="w-full sm:w-auto bg-[#141e52] hover:bg-[#1e2b6e] text-white px-8 py-2.5 rounded-[6px] font-bold text-[12px] flex items-center justify-center gap-2 shadow-lg transition-colors disabled:opacity-50"
        >
          <Save size={16} /> {saving ? 'SAVING...' : isEditMode ? 'UPDATE SIMULATION' : 'SAVE SIMULATION'}
        </button>
      </div>

      {/* Grid Content */}
      <main className="max-w-[1400px] mx-auto grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        
        {/* Left side */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Simulation Name Section with Suffix input */}
          <section className="bg-white rounded-[8px] border p-5 shadow-sm">
            <label className="text-[12px] font-bold text-navy-950 block mb-2">Simulation Name</label>
            <div className="flex items-center border border-slate-200 rounded-[6px] overflow-hidden bg-white focus-within:border-navy-950 transition-all">
              
              {/* החלק הקבוע (האוטומטי) */}
              {generatedBaseName && (
                <span className="bg-slate-100 text-slate-600 font-mono px-3 py-3 border-r border-slate-200 text-sm font-bold select-none">
                  {generatedBaseName}
                </span>
              )}
              
              {/* החלק הניתן לעריכה ידנית */}
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
          <section className="bg-white rounded-[8px] border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50/50">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Topology</h2>
            </div>

            <div className="p-4 md:p-8 flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-8">
              {activeSystems.map((sys, idx) => {
                const systemContracts = allContracts.filter(c => c.system_id === sys.selectedSystemId);

                return (
                  <div key={sys.id} className="w-full xl:w-auto flex flex-col xl:flex-row items-center gap-6 xl:gap-8">
                    
                    <div className="w-full md:max-w-md xl:w-[360px] bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-navy-900 font-black text-[11px] uppercase">
                        <Monitor size={14} /> System {idx + 1} *
                      </div>

                      {/* Dropdown 1: Systems */}
                      <select
                        value={sys.selectedSystemId}
                        onChange={(e) => updateSystem(sys.id, e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs outline-none focus:border-navy-950 transition-colors"
                      >
                        <option value="">-- Choose System * --</option>
                        {availableSystems.map(s => (
                          <option key={s.system_id} value={s.system_id}>{s.name}</option>
                        ))}
                      </select>

                      {sys.selectedSystemId && (
                        <div className="pt-4 border-t space-y-4">
                          
                          {/* Dropdown 2: Dictionaries */}
                          <label className="text-[10px] font-black text-blue-500 uppercase block">1. Select Dictionary *</label>
                          <select
                            value={sys.selectedContractId}
                            onChange={(e) => handleContractChange(sys.id, e.target.value)}
                            className="w-full p-3 bg-white border border-blue-100 rounded-lg font-bold text-xs outline-none focus:border-blue-500 transition-colors"
                          >
                            <option value="">-- Select Dictionary * --</option>
                            {systemContracts.map(c => (
                              <option key={c.contract_config_id} value={c.contract_config_id}>
                                {c.name} {c.version ? `(v${c.version})` : ''}
                              </option>
                            ))}
                          </select>

                          {/* Dropdown 3: ABC protocol */}
                          {sys.selectedContractId && (
                            <>
                              <label className="text-[10px] font-black text-purple-600 uppercase block">2. ABC Protocol Version *</label>
                              <select
                                value={sys.selectedAbcVersion}
                                onChange={(e) => handleAbcVersionChange(sys.id, e.target.value)}
                                className="w-full p-3 bg-white border border-purple-100 rounded-lg font-bold text-xs outline-none focus:border-purple-500 transition-colors"
                              >
                                <option value="">-- Select ABC Version * --</option>
                                {sys.availableAbcVersions.map(v => (
                                  <option key={v.abc_version_id} value={v.abc_version_id}>
                                    {v.abc_version_name || 'Unknown Version'}
                                  </option>
                                ))}
                              </select>
                            </>
                          )}

                          {/* Entity List View */}
                          {sys.selectedContractId && (
                            <div className="pt-4 border-t mt-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Entities *</label>
                              
                              {sys.entities && sys.entities.length > 0 ? (
                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                                  {sys.entities.map((entity, eIdx) => {
                                    const isWriter = entity.type === 'writer' || !!entity.data_writer_id;
                                    
                                    return (
                                      <div key={eIdx} className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                          {isWriter ? (
                                            <Radio size={14} className="text-orange-500" />
                                          ) : (
                                            <Database size={14} className="text-emerald-500" />
                                          )}
                                          <span className="text-[10px] font-black uppercase text-navy-900 truncate">
                                            {entity.name || 'Unnamed'}
                                          </span>
                                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 ml-auto uppercase">
                                            {isWriter ? 'Writer' : 'Reader'}
                                          </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 border-t pt-2">
                                          <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase block">MSG Count *</label>
                                            <input 
                                              type="number" 
                                              min="1"
                                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-navy-950"
                                              value={entity.message_count ?? ''}
                                              onChange={(e) => handleEntityParamChange(sys.id, eIdx, 'message_count', Number(e.target.value))}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase block">Freq (Hz) *</label>
                                            <input 
                                              type="number" 
                                              min="1"
                                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-navy-950"
                                              value={entity.message_frequency_hz ?? ''}
                                              onChange={(e) => handleEntityParamChange(sys.id, eIdx, 'message_frequency_hz', Number(e.target.value))}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-[11px] text-slate-400 italic text-center py-4 bg-slate-50/50 rounded-lg border border-dashed">
                                  No components found or loading...
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                    
                    {idx === 0 && <ArrowLeftRight size={24} className="text-slate-300 transform rotate-90 xl:rotate-0 my-2 xl:my-0" />}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right side Channel Parameters */}
        <div className="lg:col-span-3 w-full">
          <section className="bg-white rounded-[8px] border p-5 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Channel Params</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-navy-950">Latency (ms)</label>
                <input type="number" min="0" className="w-full p-2.5 bg-slate-50 border rounded text-sm focus:bg-white outline-none focus:border-navy-950" value={latency} onChange={e => setLatency(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-navy-950">Jitter (ms)</label>
                <input type="number" min="0" className="w-full p-2.5 bg-slate-50 border rounded text-sm focus:bg-white outline-none focus:border-navy-950" value={jitter} onChange={e => setJitter(Number(e.target.value))} />
              </div>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
};

export default NewSimulation;