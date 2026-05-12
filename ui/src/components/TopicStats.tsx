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
    <div className="rounded-lg border border-gray-700/50 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900/60 text-gray-400 text-xs uppercase tracking-wider">
            <th className="text-left px-3 py-2">Topic</th>
            <th className="text-right px-3 py-2">Sent</th>
            <th className="text-right px-3 py-2">Recv</th>
            <th className="text-right px-3 py-2">Lost</th>
            <th className="text-right px-3 py-2">Loss%</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {entries.map(([topic, s]) => (
            <tr key={topic} className="hover:bg-gray-900/30">
              <td className="px-3 py-2 font-mono text-cyan-400 text-xs truncate max-w-[80px]">{topic}</td>
              <td className="px-3 py-2 text-right tabular-nums text-xs">{s.sent}</td>
              <td className="px-3 py-2 text-right tabular-nums text-xs">{s.received}</td>
              <td className="px-3 py-2 text-right tabular-nums text-xs">
                <span className={s.lost > 0 ? "text-red-400" : "text-gray-500"}>{s.lost}</span>
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-xs">
                <span className={s.loss_percent > 0 ? "text-red-400 font-semibold" : "text-emerald-400"}>
                  {s.loss_percent.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
