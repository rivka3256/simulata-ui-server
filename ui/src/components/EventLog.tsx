import { useEffect, useRef, useState } from "react";
import type { RunEventInfo } from "../api";

const SEVERITY_COLORS: Record<string, string> = {
  debug: "text-gray-500",
  info: "text-blue-300",
  warning: "text-amber-400",
  error: "text-red-400",
  critical: "text-red-500 font-bold",
};

const CATEGORY_HIGHLIGHTS: Record<string, string> = {
  subscription_matched: "border-l-emerald-500",
  publication_matched: "border-l-emerald-500",
  incompatible_qos_offered: "border-l-red-500 bg-red-950/10",
  incompatible_qos_requested: "border-l-red-500 bg-red-950/10",
  message_lost: "border-l-red-500",
  error: "border-l-red-500 bg-red-950/10",
};

const CATEGORIES = [
  "subscription_matched", "publication_matched", "incompatible_qos_offered",
  "incompatible_qos_requested", "message_sent", "message_received", "message_lost",
  "participant_created", "writer_created", "reader_created", "error",
];

export default function EventLog({ events, autoScroll = true }: { events: (RunEventInfo | Record<string, any>)[]; autoScroll?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events.length, autoScroll]);

  const filtered = events.filter((e) => {
    if (categoryFilter && e.category !== categoryFilter) return false;
    if (severityFilter && e.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 px-3 py-2 bg-gray-900/40 border-b border-gray-700/50 text-xs">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-gray-800 border border-gray-600/50 rounded px-2 py-1 text-gray-200">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
        </select>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="bg-gray-800 border border-gray-600/50 rounded px-2 py-1 text-gray-200">
          <option value="">All severities</option>
          {["debug", "info", "warning", "error", "critical"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-gray-500 ml-auto">{filtered.length} / {events.length} events</span>
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto font-mono text-xs leading-relaxed">
        {filtered.map((e, i) => {
          const ts = typeof e.timestamp === "string" && e.timestamp.length > 19 ? e.timestamp.substring(11, 23) : e.timestamp ?? "";
          const sevColor = SEVERITY_COLORS[e.severity] ?? "text-gray-300";
          const highlight = CATEGORY_HIGHLIGHTS[e.category] ?? "border-l-transparent";
          return (
            <div key={e.id ?? i} className={`flex gap-3 px-3 py-1 border-l-2 hover:bg-gray-900/30 ${highlight}`}>
              <span className="text-gray-500 w-20 shrink-0">{ts}</span>
              <span className={`w-16 shrink-0 uppercase ${sevColor}`}>{e.severity}</span>
              <span className="text-gray-400 w-44 shrink-0 truncate">{e.category?.replace(/_/g, " ")}</span>
              <span className="text-cyan-400 w-28 shrink-0 truncate">{e.topic ?? ""}</span>
              <span className="text-gray-200 truncate">{e.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
