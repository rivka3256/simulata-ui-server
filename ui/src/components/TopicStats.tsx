

interface TopicStat {
  sent: number;
  received: number;
  lost: number;
  rejected?: number;
  loss_percent: number;
}

export default function TopicStats({ stats }: { stats: Record<string, TopicStat> }) {
  const entries = Object.entries(stats);
  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden shadow-md bg-slate-900/20">
      <table className="w-full text-sm text-slate-300">
        <thead>
          <tr className="bg-slate-900/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
            <th className="text-left px-3 py-2">Topic</th>
            <th className="text-right px-3 py-2">Sent</th>
            <th className="text-right px-3 py-2">Recv</th>
            <th className="text-right px-3 py-2">Lost</th>
            <th className="text-right px-3 py-2">Loss%</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/40">
          {entries.map(([topic, s]) => (
            <tr key={topic} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-3 py-2 font-mono text-sky-400 text-xs truncate max-w-[90px]" title={topic}>{topic}</td>
              <td className="px-3 py-2 text-right tabular-nums text-xs">{s.sent}</td>
              <td className="px-3 py-2 text-right tabular-nums text-xs">{s.received}</td>
              <td className="px-3 py-2 text-right tabular-nums text-xs">
                <span className={s.lost > 0 ? "text-rose-400 font-medium animate-pulse" : "text-slate-500"}>{s.lost}</span>
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-xs">
                <span className={s.loss_percent > 0 ? "text-rose-400 font-bold" : "text-emerald-400 font-medium"}>
                  {(s.loss_percent ?? 0).toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}