import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft, Save, Settings, ArrowLeftRight,
  Plus, Monitor, Trash2, Book, Radio, Database,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { 
  createSimulation, 
  getAllSimulations 
} from '../api/index';
import { listSystems, listDictionaries } from '../api/index';
import type { SystemInfo, Dictionary } from '../api/index';

// ─── Local-only types (UI state, never sent to server) ────────────────────────

interface SystemInterface {
  id: string;
  type: 'Writer' | 'Reader';
  messageCount: number;
  frequencyHz: number;
}

interface ActiveSystem {
  id: string;
  selectedSystemId: string;
  selectedDictId: string;
  interfaces: SystemInterface[];
}

const DEFAULT_SYSTEMS: ActiveSystem[] = [
  { id: '1', selectedSystemId: '', selectedDictId: '', interfaces: [] },
  { id: '2', selectedSystemId: '', selectedDictId: '', interfaces: [] },
];

// ─── Component ────────────────────────────────────────────────────────────────

const NewSimulation = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditMode = !!id;
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Server-bound state ---
  const [scenarioName, setScenarioName] = useState('');
  const [latency, setLatency] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [saving, setSaving] = useState(false);
  const [assertions, setAssertions] = useState({
    deliveryComplete: false,
    noErrors: false,
    allMatched: false,
  });

  // --- Local UI-only state ---
  const [activeSystems, setActiveSystems] = useState<ActiveSystem[]>(DEFAULT_SYSTEMS);
  const [availableSystems, setAvailableSystems] = useState<SystemInfo[]>([]);
  const [allDictionaries, setAllDictionaries] = useState<Dictionary[]>([]);

  // ─── Load data ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const [systems, dicts, scenarios] = await Promise.all([
          listSystems(),
          listDictionaries(),
          getAllSimulations(),
        ]);
        setAvailableSystems(systems);
        setAllDictionaries(dicts);

        if (!isEditMode) return;
        const scenario = scenarios.find(
          (s) => String(s.simulation_config_id ).trim() === String(id).trim()
        );
        if (!scenario) return;

        setScenarioName(scenario.scenario_name || '');
const config = scenario as any;
        if (!config) return;
        setLatency(config.transport_latency_ms || 0);
        setJitter(config.transport_jitter_ms || 0);
        if (config.assertions) {
          const types = config.assertions.map((a: any) => a.type);
          setAssertions({
            deliveryComplete: types.includes('delivery_complete'),
            noErrors: types.includes('no_errors'),
            allMatched: types.includes('all_matched'),
          });
        }
      } catch {
        toast('Failed to load scenario data', 'error');
      }
    };
    load();
  }, [id, isEditMode, toast]);

  // ─── Local UI handlers (topology - never touches server) ────────────────────

  const scrollToEnd = () =>
    setTimeout(() => scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' }), 100);

  const addSystem = () => {
    setActiveSystems((prev) => [...prev, { id: Date.now().toString(), selectedSystemId: '', selectedDictId: '', interfaces: [] }]);
    scrollToEnd();
  };

  const removeSystem = (boxId: string) => {
    if (activeSystems.length > 2) setActiveSystems((prev) => prev.filter((s) => s.id !== boxId));
  };

  const updateSystem = (boxId: string, systemId: string) =>
    setActiveSystems((prev) => prev.map((s) => s.id === boxId ? { ...s, selectedSystemId: systemId, selectedDictId: '', interfaces: [] } : s));

  const updateDict = (boxId: string, dictId: string) =>
    setActiveSystems((prev) => prev.map((s) => s.id === boxId ? { ...s, selectedDictId: dictId, interfaces: [] } : s));

  const addInterface = (boxId: string, type: 'Writer' | 'Reader') =>
    setActiveSystems((prev) => prev.map((s) =>
      s.id === boxId
        ? { ...s, interfaces: [...s.interfaces, { id: `int-${Date.now()}`, type, messageCount: 100, frequencyHz: 10 }] }
        : s
    ));

  const updateInterface = (boxId: string, intId: string, field: keyof SystemInterface, value: any) =>
    setActiveSystems((prev) => prev.map((s) =>
      s.id === boxId
        ? { ...s, interfaces: s.interfaces.map((i) => i.id === intId ? { ...i, [field]: value } : i) }
        : s
    ));

  const removeInterface = (boxId: string, intId: string) =>
    setActiveSystems((prev) => prev.map((s) =>
      s.id === boxId ? { ...s, interfaces: s.interfaces.filter((i) => i.id !== intId) } : s
    ));

  // ─── Save - builds full hierarchy matching server models ──────────────────

  const handleSave = async () => {
    if (!scenarioName.trim()) {
      toast('Please enter a simulation name', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        simulation_config_id: id,
        scenario_name: scenarioName,
        productions: activeSystems
          .filter((sys) => sys.interfaces.length > 0)
          .map((sys) => ({
            contracts: sys.interfaces.map((iface) => ({
              version: '1.0.0',
              ...(iface.type === 'Writer'
                ? { dataWriter: { message_count: iface.messageCount, message_frequency_hz: iface.frequencyHz } }
                : { dataReader: { message_count: iface.messageCount, message_frequency_hz: iface.frequencyHz } }
              ),
            })),
          })),
      };

      console.log("🚀 Sending Payload to Server:", JSON.stringify(payload, null, 2));

      await createSimulation(payload as any);
      toast(isEditMode ? 'Updated successfully!' : 'Saved successfully!', 'success');
      navigate('/simulations');
    } catch {
      toast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-heebo" dir="ltr">

      {/* Header */}
      <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-navy-950 uppercase tracking-tight">
            {isEditMode ? 'Edit Simulation' : 'New Simulation'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#141e52] text-white px-8 py-2.5 rounded-[6px] font-bold text-[12px] hover:bg-navy-900 flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
        >
          <Save size={16} /> {saving ? 'SAVING...' : 'SAVE SIMULATION'}
        </button>
      </div>

      <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-9 space-y-8">

          {/* Scenario Context */}
          <section className="bg-white rounded-[8px] border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-slate-400">
              <Settings size={14} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Scenario Context</h2>
            </div>
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-navy-950">Simulation Name</label>
              <input
                className={`w-full px-4 py-3 border rounded-[6px] outline-none transition-all text-sm ${
                  isEditMode ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-slate-50 border-slate-200 focus:border-navy-950'
                }`}
                value={scenarioName}
                onChange={(e) => !isEditMode && setScenarioName(e.target.value)}
                readOnly={isEditMode}
                placeholder="Enter simulation name..."
              />
            </div>
          </section>

          {/* Network Topology - local UI only */}
          <section className="bg-white rounded-[8px] border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Network Topology</h2>
              <button onClick={addSystem} className="flex items-center gap-2 text-[10px] font-black text-navy-600 hover:text-navy-950 transition-colors">
                <Plus size={14} /> ADD SYSTEM
              </button>
            </div>

            <div ref={scrollRef} className="p-8 overflow-x-auto scroll-smooth">
              <div className="flex items-start gap-12 min-w-max pb-4">
                {activeSystems.map((sys, index) => {
                  const filteredDicts = allDictionaries.filter((d) => d.systemId === sys.selectedSystemId);
                  return (
                    <div key={sys.id} className="flex items-start gap-12">
                      <div className="w-[320px] group flex-shrink-0">
                        {/* System header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-navy-900 p-1.5 rounded text-white"><Monitor size={14} /></div>
                            <span className="text-[11px] font-black text-navy-900 uppercase">System {index + 1}</span>
                          </div>
                          {activeSystems.length > 2 && (
                            <button onClick={() => removeSystem(sys.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* System card */}
                        <div className="bg-slate-50 border border-slate-200 rounded-[8px] p-5 shadow-sm space-y-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Select System</label>
                            <select
                              value={sys.selectedSystemId}
                              onChange={(e) => updateSystem(sys.id, e.target.value)}
                              className="w-full p-2.5 bg-white border border-slate-200 rounded font-bold text-xs outline-none"
                            >
                              <option value="">-- Choose System --</option>
                              {availableSystems.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                          </div>

                          <div className="pt-4 border-t border-slate-200">
                            {!sys.selectedSystemId ? (
                              <div className="py-4 text-center">
                                <p className="text-[10px] font-bold text-red-500 mb-2 animate-pulse">! SELECT SYSTEM FIRST</p>
                                <div className="py-3 border-2 border-dashed border-slate-200 rounded text-slate-300 flex items-center justify-center gap-2">
                                  <Book size={14} /><span className="text-[10px] font-black uppercase">Locked</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div>
                                  <label className="text-[10px] font-black text-blue-500 uppercase block mb-1">Available Dictionaries</label>
                                  <select
                                    value={sys.selectedDictId}
                                    onChange={(e) => updateDict(sys.id, e.target.value)}
                                    className="w-full p-2.5 bg-white border border-blue-200 rounded font-bold text-xs outline-none mb-3"
                                  >
                                    <option value="">-- Select Dictionary --</option>
                                    {filteredDicts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                                  </select>
                                </div>

                                {sys.selectedDictId && (
                                  <div className="space-y-3 pt-2">
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter">Active Interfaces</label>
                                    {sys.interfaces.map((int) => (
                                      <div key={int.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm group/int">
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center gap-2">
                                            {int.type === 'Writer'
                                              ? <Radio size={14} className="text-orange-500" />
                                              : <Database size={14} className="text-emerald-500" />}
                                            <span className="text-[10px] font-black uppercase text-slate-700">{int.type}</span>
                                          </div>
                                          <button onClick={() => removeInterface(sys.id, int.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                          <div className="space-y-1">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Messages</label>
                                            <input
                                              type="number"
                                              className="w-full border border-slate-200 rounded p-1.5 text-[10px] font-bold outline-none"
                                              value={int.messageCount}
                                              onChange={(e) => updateInterface(sys.id, int.id, 'messageCount', Number(e.target.value))}
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Freq (Hz)</label>
                                            <input
                                              type="number"
                                              className="w-full border border-slate-200 rounded p-1.5 text-[10px] font-bold outline-none"
                                              value={int.frequencyHz}
                                              onChange={(e) => updateInterface(sys.id, int.id, 'frequencyHz', Number(e.target.value))}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div className="flex gap-2 pt-2">
                                      <button onClick={() => addInterface(sys.id, 'Writer')} className="flex-1 py-2 border border-dashed border-orange-200 rounded text-[9px] font-black text-orange-600 flex items-center justify-center gap-1">
                                        <Plus size={12} /> WRITER
                                      </button>
                                      <button onClick={() => addInterface(sys.id, 'Reader')} className="flex-1 py-2 border border-dashed border-emerald-200 rounded text-[9px] font-black text-emerald-600 flex items-center justify-center gap-1">
                                        <Plus size={12} /> READER
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {index < activeSystems.length - 1 && (
                        <div className="self-center pt-8 text-slate-300 flex-shrink-0">
                          <ArrowLeftRight size={20} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="col-span-3 space-y-6">
          <section className="bg-white rounded-[8px] border p-6 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-6">Channel Params</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold">Latency (ms)</label>
                <input type="number" className="w-full p-2.5 bg-slate-50 border rounded-[6px] text-sm outline-none" value={latency} onChange={(e) => setLatency(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold">Jitter (ms)</label>
                <input type="number" className="w-full p-2.5 bg-slate-50 border rounded-[6px] text-sm outline-none" value={jitter} onChange={(e) => setJitter(Number(e.target.value))} />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[8px] border p-6 shadow-sm">
            <h2 className="text-[10px] font-black text-slate-400 uppercase mb-6">Health Checks</h2>
            <div className="space-y-3">
              {[
                { id: 'deliveryComplete', label: 'DELIVERY' },
                { id: 'noErrors', label: 'ERROR FREE' },
                { id: 'allMatched', label: 'DDS MATCH' },
              ].map((check) => (
                <label key={check.id} className="flex items-center justify-between p-3 rounded-[6px] border border-slate-100 bg-slate-50/30 cursor-pointer">
                  <span className="text-[10px] font-black text-navy-950">{check.label}</span>
                  <input
                    type="checkbox"
                    checked={assertions[check.id as keyof typeof assertions]}
                    onChange={(e) => setAssertions((prev) => ({ ...prev, [check.id]: e.target.checked }))}
                    className="w-4 h-4 rounded text-navy-900"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default NewSimulation;

// import { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   ChevronLeft, Save, Settings, ArrowLeftRight,
//   Plus, Monitor, Trash2, Book, Radio, Database,
// } from 'lucide-react';
// import { useToast } from '../components/Toast';
// // עדכון ה-Import כדי להשתמש בפונקציות מהמבנה החדש
// import { 
//   createSimulation, 
//   getAllSimulations, 
//   listSystems, 
//   listDictionaries 
// } from '../api/index';
// import type { SystemInfo, Dictionary } from '../api/index';

// // ─── Local-only types (UI state, never sent to server) ────────────────────────

// interface SystemInterface {
//   id: string;
//   type: 'Writer' | 'Reader';
//   messageCount: number;
//   frequencyHz: number;
// }

// interface ActiveSystem {
//   id: string;
//   selectedSystemId: string;
//   selectedDictId: string;
//   interfaces: SystemInterface[];
// }

// const DEFAULT_SYSTEMS: ActiveSystem[] = [
//   { id: '1', selectedSystemId: '', selectedDictId: '', interfaces: [] },
//   { id: '2', selectedSystemId: '', selectedDictId: '', interfaces: [] },
// ];

// // ─── Component ────────────────────────────────────────────────────────────────

// const NewSimulation = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const { toast } = useToast();
//   const isEditMode = !!id;
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // --- Server-bound state ---
//   const [scenarioName, setScenarioName] = useState('');
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);
//   const [saving, setSaving] = useState(false);
//   const [assertions, setAssertions] = useState({
//     deliveryComplete: false,
//     noErrors: false,
//     allMatched: false,
//   });

//   // --- Local UI-only state ---
//   const [activeSystems, setActiveSystems] = useState<ActiveSystem[]>(DEFAULT_SYSTEMS);
//   const [availableSystems, setAvailableSystems] = useState<SystemInfo[]>([]);
//   const [allDictionaries, setAllDictionaries] = useState<Dictionary[]>([]);

//   // ─── Load data ──────────────────────────────────────────────────────────────
// // ─── Load data ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [systems, dicts, scenarios] = await Promise.all([
//           listSystems(),
//           listDictionaries(),
//           getAllSimulations(),
//         ]);
//         setAvailableSystems(systems);
//         setAllDictionaries(dicts);

//         if (!isEditMode) return;

//         const scenario = scenarios.find(
//           (s: any) => String(s.simulation_config_id || s.id) === String(id)
//         ) as any;

//         if (!scenario) return;

//         setScenarioName(scenario.scenario_name || '');
//         
//         const config = scenario.scenario_config || scenario; 
//         if (config) {
//           setLatency(config.transport_latency_ms || 0);
//           setJitter(config.transport_jitter_ms || 0);
//         }
//       } catch (error) {
//         console.error("Load error:", error);
//       }
//     };

//     load(); // <--- השורה הזו היתה חסרה! זה מה שמפעיל את הטעינה
//   }, [id, isEditMode]); // מוודא שטוען מחדש אם ה-ID משתנה
//   // ─── Local UI handlers (topology - never touches server) ────────────────────

//   const scrollToEnd = () =>
//     setTimeout(() => scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' }), 100);

//   const addSystem = () => {
//     setActiveSystems((prev) => [...prev, { id: Date.now().toString(), selectedSystemId: '', selectedDictId: '', interfaces: [] }]);
//     scrollToEnd();
//   };

//   const removeSystem = (boxId: string) => {
//     if (activeSystems.length > 2) setActiveSystems((prev) => prev.filter((s) => s.id !== boxId));
//   };

//   const updateSystem = (boxId: string, systemId: string) =>
//     setActiveSystems((prev) => prev.map((s) => s.id === boxId ? { ...s, selectedSystemId: systemId, selectedDictId: '', interfaces: [] } : s));

//   const updateDict = (boxId: string, dictId: string) =>
//     setActiveSystems((prev) => prev.map((s) => s.id === boxId ? { ...s, selectedDictId: dictId, interfaces: [] } : s));

//   const addInterface = (boxId: string, type: 'Writer' | 'Reader') =>
//     setActiveSystems((prev) => prev.map((s) =>
//       s.id === boxId
//         ? { ...s, interfaces: [...s.interfaces, { id: `int-${Date.now()}`, type, messageCount: 100, frequencyHz: 10 }] }
//         : s
//     ));

//   const updateInterface = (boxId: string, intId: string, field: keyof SystemInterface, value: any) =>
//     setActiveSystems((prev) => prev.map((s) =>
//       s.id === boxId
//         ? { ...s, interfaces: s.interfaces.map((i) => i.id === intId ? { ...i, [field]: value } : i) }
//         : s
//     ));

//   const removeInterface = (boxId: string, intId: string) =>
//     setActiveSystems((prev) => prev.map((s) =>
//       s.id === boxId ? { ...s, interfaces: s.interfaces.filter((i) => i.id !== intId) } : s
//     ));

//   // ─── Save - builds full hierarchy matching server models ──────────────────
//   const handleSave = async () => {
//     if (!scenarioName.trim()) {
//       toast('Please enter a simulation name', 'error');
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         simulation_config_id: id || `sim-${Date.now()}`,
//         scenario_name: scenarioName,
//         productions: activeSystems
//           .filter((sys) => sys.interfaces.length > 0)
//           .map((sys) => ({
//             production_config_id: sys.selectedSystemId,
//             contracts: sys.interfaces.map((iface) => ({
//               version: '1.0.0',
//               ...(iface.type === 'Writer'
//                 ? { 
//                     dataWriter: { 
//                       message_count: iface.messageCount, 
//                       message_frequency_hz: iface.frequencyHz 
//                     } 
//                   }
//                 : { 
//                     dataReader: { 
//                       message_count: iface.messageCount, 
//                       message_frequency_hz: iface.frequencyHz 
//                     } 
//                   }
//               ),
//             })),
//           })),
//       };

//       // קריאה לפונקציה הנכונה מה-API החדש
//       await createSimulation(payload as any);
      
//       toast(isEditMode ? 'Updated successfully!' : 'Saved successfully!', 'success');
//       navigate('/simulations');
//     } catch (error) {
//       console.error("Save error:", error);
//       toast('Failed to save. Check if the server is running on port 3000', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ─── Render ─────────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-8 font-heebo" dir="ltr">

//       {/* Header */}
//       <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold text-navy-950 uppercase tracking-tight">
//             {isEditMode ? 'Edit Simulation' : 'New Simulation'}
//           </h1>
//         </div>
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="bg-[#141e52] text-white px-8 py-2.5 rounded-[6px] font-bold text-[12px] hover:bg-navy-900 flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
//         >
//           <Save size={16} /> {saving ? 'SAVING...' : 'SAVE SIMULATION'}
//         </button>
//       </div>

//       <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
//         <div className="col-span-9 space-y-8">

//           {/* Scenario Context */}
//           <section className="bg-white rounded-[8px] border p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6 text-slate-400">
//               <Settings size={14} />
//               <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Scenario Context</h2>
//             </div>
//             <div className="space-y-1">
//               <label className="text-[12px] font-bold text-navy-950">Simulation Name</label>
//               <input
//                 className={`w-full px-4 py-3 border rounded-[6px] outline-none transition-all text-sm ${
//                   isEditMode ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-slate-50 border-slate-200 focus:border-navy-950'
//                 }`}
//                 value={scenarioName}
//                 onChange={(e) => !isEditMode && setScenarioName(e.target.value)}
//                 readOnly={isEditMode}
//                 placeholder="Enter simulation name..."
//               />
//             </div>
//           </section>

//           {/* Network Topology - local UI only */}
//           <section className="bg-white rounded-[8px] border shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b bg-slate-50/50 flex items-center justify-between">
//               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Network Topology</h2>
//               <button onClick={addSystem} className="flex items-center gap-2 text-[10px] font-black text-navy-600 hover:text-navy-950 transition-colors">
//                 <Plus size={14} /> ADD SYSTEM
//               </button>
//             </div>

//             <div ref={scrollRef} className="p-8 overflow-x-auto scroll-smooth">
//               <div className="flex items-start gap-12 min-w-max pb-4">
//                 {activeSystems.map((sys, index) => {
//                   const filteredDicts = allDictionaries.filter((d) => d.systemId === sys.selectedSystemId);
//                   return (
//                     <div key={sys.id} className="flex items-start gap-12">
//                       <div className="w-[320px] group flex-shrink-0">
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center gap-2">
//                             <div className="bg-navy-900 p-1.5 rounded text-white"><Monitor size={14} /></div>
//                             <span className="text-[11px] font-black text-navy-900 uppercase">System {index + 1}</span>
//                           </div>
//                           {activeSystems.length > 2 && (
//                             <button onClick={() => removeSystem(sys.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
//                               <Trash2 size={14} />
//                             </button>
//                           )}
//                         </div>

//                         <div className="bg-slate-50 border border-slate-200 rounded-[8px] p-5 shadow-sm space-y-4">
//                           <div>
//                             <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Select System</label>
//                             <select
//                               value={sys.selectedSystemId}
//                               onChange={(e) => updateSystem(sys.id, e.target.value)}
//                               className="w-full p-2.5 bg-white border border-slate-200 rounded font-bold text-xs outline-none"
//                             >
//                               <option value="">-- Choose System --</option>
//                               {availableSystems.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
//                             </select>
//                           </div>

//                           <div className="pt-4 border-t border-slate-200">
//                             {!sys.selectedSystemId ? (
//                               <div className="py-4 text-center">
//                                 <p className="text-[10px] font-bold text-red-500 mb-2 animate-pulse">! SELECT SYSTEM FIRST</p>
//                                 <div className="py-3 border-2 border-dashed border-slate-200 rounded text-slate-300 flex items-center justify-center gap-2">
//                                   <Book size={14} /><span className="text-[10px] font-black uppercase">Locked</span>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="space-y-4">
//                                 <div>
//                                   <label className="text-[10px] font-black text-blue-500 uppercase block mb-1">Available Dictionaries</label>
//                                   <select
//                                     value={sys.selectedDictId}
//                                     onChange={(e) => updateDict(sys.id, e.target.value)}
//                                     className="w-full p-2.5 bg-white border border-blue-200 rounded font-bold text-xs outline-none mb-3"
//                                   >
//                                     <option value="">-- Select Dictionary --</option>
//                                     {filteredDicts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
//                                   </select>
//                                 </div>

//                                 {sys.selectedDictId && (
//                                   <div className="space-y-3 pt-2">
//                                     <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter">Active Interfaces</label>
//                                     {sys.interfaces.map((int) => (
//                                       <div key={int.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm group/int">
//                                         <div className="flex items-center justify-between mb-3">
//                                           <div className="flex items-center gap-2">
//                                             {int.type === 'Writer'
//                                               ? <Radio size={14} className="text-orange-500" />
//                                               : <Database size={14} className="text-emerald-500" />}
//                                             <span className="text-[10px] font-black uppercase text-slate-700">{int.type}</span>
//                                           </div>
//                                           <button onClick={() => removeInterface(sys.id, int.id)} className="text-slate-300 hover:text-red-500 transition-colors">
//                                             <Trash2 size={12} />
//                                           </button>
//                                         </div>
//                                         <div className="grid grid-cols-2 gap-3">
//                                           <div className="space-y-1">
//                                             <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Messages</label>
//                                             <input
//                                               type="number"
//                                               className="w-full border border-slate-200 rounded p-1.5 text-[10px] font-bold outline-none"
//                                               value={int.messageCount}
//                                               onChange={(e) => updateInterface(sys.id, int.id, 'messageCount', Number(e.target.value))}
//                                             />
//                                           </div>
//                                           <div className="space-y-1">
//                                             <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Freq (Hz)</label>
//                                             <input
//                                               type="number"
//                                               className="w-full border border-slate-200 rounded p-1.5 text-[10px] font-bold outline-none"
//                                               value={int.frequencyHz}
//                                               onChange={(e) => updateInterface(sys.id, int.id, 'frequencyHz', Number(e.target.value))}
//                                             />
//                                           </div>
//                                         </div>
//                                       </div>
//                                     ))}
//                                     <div className="flex gap-2 pt-2">
//                                       <button onClick={() => addInterface(sys.id, 'Writer')} className="flex-1 py-2 border border-dashed border-orange-200 rounded text-[9px] font-black text-orange-600 flex items-center justify-center gap-1">
//                                         <Plus size={12} /> WRITER
//                                       </button>
//                                       <button onClick={() => addInterface(sys.id, 'Reader')} className="flex-1 py-2 border border-dashed border-emerald-200 rounded text-[9px] font-black text-emerald-600 flex items-center justify-center gap-1">
//                                         <Plus size={12} /> READER
//                                       </button>
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       {index < activeSystems.length - 1 && (
//                         <div className="self-center pt-8 text-slate-300 flex-shrink-0">
//                           <ArrowLeftRight size={20} />
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </section>
//         </div>

//         {/* Sidebar */}
//         <div className="col-span-3 space-y-6">
//           <section className="bg-white rounded-[8px] border p-6 shadow-sm">
//             <h2 className="text-[10px] font-black text-slate-400 uppercase mb-6">Channel Params</h2>
//             <div className="space-y-4">
//               <div className="space-y-1">
//                 <label className="text-[11px] font-bold">Latency (ms)</label>
//                 <input type="number" className="w-full p-2.5 bg-slate-50 border rounded-[6px] text-sm outline-none" value={latency} onChange={(e) => setLatency(Number(e.target.value))} />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[11px] font-bold">Jitter (ms)</label>
//                 <input type="number" className="w-full p-2.5 bg-slate-50 border rounded-[6px] text-sm outline-none" value={jitter} onChange={(e) => setJitter(Number(e.target.value))} />
//               </div>
//             </div>
//           </section>

//           <section className="bg-white rounded-[8px] border p-6 shadow-sm">
//             <h2 className="text-[10px] font-black text-slate-400 uppercase mb-6">Health Checks</h2>
//             <div className="space-y-3">
//               {[
//                 { id: 'deliveryComplete', label: 'DELIVERY' },
//                 { id: 'noErrors', label: 'ERROR FREE' },
//                 { id: 'allMatched', label: 'DDS MATCH' },
//               ].map((check) => (
//                 <label key={check.id} className="flex items-center justify-between p-3 rounded-[6px] border border-slate-100 bg-slate-50/30 cursor-pointer">
//                   <span className="text-[10px] font-black text-navy-950">{check.label}</span>
//                   <input
//                     type="checkbox"
//                     checked={assertions[check.id as keyof typeof assertions]}
//                     onChange={(e) => setAssertions((prev) => ({ ...prev, [check.id]: e.target.checked }))}
//                     className="w-4 h-4 rounded text-navy-900"
//                   />
//                 </label>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default NewSimulation;