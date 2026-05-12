import { useEffect, useState, useCallback } from "react";
import { Upload, Trash2, Eye, Network, AlertTriangle, ChevronRight } from "lucide-react";
import { listProfiles, createProfile, deleteProfile, getProfileTopology, fetchProfileXml, type ProfileInfo, type TopologyInfo } from "../api/index";
import { useToast } from "../components/Toast";

export default function Profiles() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadXml, setUploadXml] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadWarnings, setUploadWarnings] = useState<{ severity: string; message: string; location: string }[]>([]);

  const [selectedTopology, setSelectedTopology] = useState<{ id: string; name: string; topo: TopologyInfo } | null>(null);
  const [expandedXml, setExpandedXml] = useState<string | null>(null);
  const [xmlContent, setXmlContent] = useState<Record<string, string>>({});
  const [xmlLoading, setXmlLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setProfiles(await listProfiles());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async () => {
    if (!uploadName.trim() || !uploadXml.trim()) return;
    setUploading(true);
    try {
      const result = await createProfile(uploadName, uploadXml);
      setUploadWarnings(result.validation_warnings || []);
      setUploadName(""); setUploadXml("");
      if (!result.validation_warnings?.length) { setShowUpload(false); toast("Profile uploaded successfully", "success"); }
      else toast("Profile uploaded with warnings", "info");
      await load();
    } catch (e: any) {
      toast(`Upload failed: ${e.message}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadXml(reader.result as string);
      if (!uploadName) setUploadName(file.name.replace(/\.xml$/i, ""));
    };
    reader.readAsText(file);
  };

  const handleDelete = async (id: string) => {
    try { await deleteProfile(id); toast("Profile deleted", "success"); await load(); }
    catch (e: any) { toast(`Delete failed: ${e.message}`, "error"); }
  };

  const handleViewTopology = async (profile: ProfileInfo) => {
    try { const topo = await getProfileTopology(profile.id); setSelectedTopology({ id: profile.id, name: profile.name, topo }); }
    catch (e: any) { setError(e.message); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">DDS Profiles</h1>
          <p className="text-sm text-gray-400 mt-1">Upload and manage RTI Connext DDS XML configurations</p>
        </div>
        <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-medium transition-colors">
          <Upload size={16} /> Upload XML
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-300">dismiss</button>
        </div>
      )}

      {showUpload && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-300">Upload DDS XML Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Profile Name</label>
              <input value={uploadName} onChange={(e) => setUploadName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" placeholder="e.g. sensor_system" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">XML File</label>
              <input type="file" accept=".xml" onChange={handleFileSelect} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm file:mr-3 file:bg-gray-700 file:border-0 file:text-gray-300 file:text-sm file:px-3 file:py-1 file:rounded" />
            </div>
          </div>
          {uploadXml && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">XML Preview ({uploadXml.length} chars)</label>
              <pre className="bg-gray-900 border border-gray-700 rounded p-3 text-xs text-gray-400 max-h-48 overflow-auto">{uploadXml.slice(0, 2000)}</pre>
            </div>
          )}
          {uploadWarnings.length > 0 && (
            <div className="space-y-1">
              {uploadWarnings.map((w, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs px-3 py-1 rounded ${w.severity === "error" ? "bg-red-900/30 text-red-300" : "bg-yellow-900/30 text-yellow-300"}`}>
                  <AlertTriangle size={12} />
                  {w.location && <span className="font-mono">{w.location}:</span>}
                  {w.message}
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button onClick={() => { setShowUpload(false); setUploadWarnings([]); }} className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200">Cancel</button>
            <button onClick={handleUpload} disabled={uploading || !uploadName || !uploadXml} className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded text-sm font-medium transition-colors">
              {uploading ? "Uploading..." : "Upload & Parse"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No profiles yet. Upload an RTI DDS XML file to get started.</div>
      ) : (
        <div className="space-y-3">
          {profiles.map((p) => (
            <div key={p.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {p.description || "No description"} · Created {p.created_at ? new Date(p.created_at).toLocaleDateString() : "unknown"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={async () => {
                    if (expandedXml === p.id) { setExpandedXml(null); return; }
                    if (!xmlContent[p.id]) {
                      setXmlLoading(p.id);
                      try { const res = await fetchProfileXml(p.id); setXmlContent((prev) => ({ ...prev, [p.id]: res.xml })); }
                      catch (e: any) { setXmlContent((prev) => ({ ...prev, [p.id]: `Error: ${e.message}` })); }
                      finally { setXmlLoading(null); }
                    }
                    setExpandedXml(p.id);
                  }} className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded" title="View XML">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => handleViewTopology(p)} className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700 rounded" title="View topology">
                    <Network size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {p.profile_data && (
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>{p.profile_data.participant_libraries?.reduce((acc: number, lib: any) => acc + (lib.participants?.length || 0), 0) || 0} participants</span>
                  <span>{p.profile_data.domain_libraries?.reduce((acc: number, lib: any) => acc + (lib.domains?.reduce((a: number, d: any) => a + (d.topics?.length || 0), 0) || 0), 0) || 0} topics</span>
                  <span>{p.profile_data.qos_libraries?.reduce((acc: number, lib: any) => acc + (lib.profiles?.length || 0), 0) || 0} QoS profiles</span>
                </div>
              )}

              {expandedXml === p.id && (
                <pre className="mt-3 bg-gray-900 border border-gray-700 rounded p-3 text-xs text-gray-400 max-h-64 overflow-auto">
                  {xmlLoading === p.id ? "Loading XML..." : xmlContent[p.id] || "No XML available"}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedTopology && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Topology: {selectedTopology.name}</h2>
              <button onClick={() => setSelectedTopology(null)} className="text-gray-400 hover:text-gray-200 text-sm">Close</button>
            </div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Domains</h3>
            <div className="flex gap-2 mb-4">
              {selectedTopology.topo.domains.map((d) => (
                <span key={d.name} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">{d.name} (ID: {d.domain_id})</span>
              ))}
            </div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Topics</h3>
            <div className="flex gap-2 mb-4 flex-wrap">
              {selectedTopology.topo.topics.map((t) => (
                <span key={t.name} className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">{t.name} ({t.type_ref})</span>
              ))}
            </div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Participants</h3>
            <div className="space-y-3">
              {selectedTopology.topo.participants.map((p) => (
                <div key={p.name} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                  <div className="font-medium text-sm">{p.name} <span className="text-xs text-gray-500">(domain {p.domain_id})</span></div>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {p.writers.length > 0 && (
                      <div>
                        <div className="text-xs text-cyan-400 mb-1">Writers</div>
                        {p.writers.map((w) => (
                          <div key={w.name} className="text-xs text-gray-400 flex items-center gap-1"><ChevronRight size={10} />{w.name} → {w.topic}</div>
                        ))}
                      </div>
                    )}
                    {p.readers.length > 0 && (
                      <div>
                        <div className="text-xs text-emerald-400 mb-1">Readers</div>
                        {p.readers.map((r) => (
                          <div key={r.name} className="text-xs text-gray-400 flex items-center gap-1"><ChevronRight size={10} />{r.name} ← {r.topic}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
