import { useMemo } from "react";

interface TopicNode { name: string; fields?: { name: string; type: string }[] }
interface ParticipantNode { name: string; writers: string[]; readers: string[] }
interface LiveStats {
  sent: Record<string, number>;
  received: Record<string, number>;
  incompatible: Set<string>;
  matched: Set<string>;
}
interface Props { config: Record<string, any>; liveStats?: LiveStats; isRunning?: boolean; compact?: boolean }

const NODE_W = 160, NODE_H = 48, TOPIC_W = 140, TOPIC_H = 40, Y_GAP = 20, COL_GAP = 100;

function parseConfig(config: Record<string, any>) {
  const topics: TopicNode[] = (config.topics ?? []).map((t: any) => ({ name: t.name, fields: t.fields }));
  const participants: ParticipantNode[] = (config.participants ?? []).map((p: any) => ({
    name: p.name,
    writers: (p.writers ?? []).map((w: any) => w.topic),
    readers: (p.readers ?? []).map((r: any) => r.topic),
  }));
  return { topics, participants };
}

export default function SimulationGraph({ config, liveStats, isRunning = false, compact = false }: Props) {
  const { topics, participants } = useMemo(() => parseConfig(config), [config]);
  const publishers = participants.filter((p) => p.writers.length > 0);
  const subscribers = participants.filter((p) => p.readers.length > 0);

  const colX = [60, 60 + NODE_W + COL_GAP, 60 + NODE_W + COL_GAP + TOPIC_W + COL_GAP];
  const pubPositions = publishers.map((_, i) => ({ x: colX[0], y: 50 + i * (NODE_H + Y_GAP) }));
  const topicPositions = topics.map((_, i) => ({ x: colX[1], y: 50 + i * (TOPIC_H + Y_GAP) }));
  const subPositions = subscribers.map((_, i) => ({ x: colX[2], y: 50 + i * (NODE_H + Y_GAP) }));

  const maxPubH = Math.max(publishers.length * (NODE_H + Y_GAP) - Y_GAP, 0);
  const maxTopicH = Math.max(topics.length * (TOPIC_H + Y_GAP) - Y_GAP, 0);
  const maxSubH = Math.max(subscribers.length * (NODE_H + Y_GAP) - Y_GAP, 0);
  const totalH = Math.max(maxPubH, maxTopicH, maxSubH, 100);

  pubPositions.forEach((p) => (p.y += (totalH - maxPubH) / 2));
  topicPositions.forEach((p) => (p.y += (totalH - maxTopicH) / 2));
  subPositions.forEach((p) => (p.y += (totalH - maxSubH) / 2));

  const svgW = colX[2] + NODE_W + 60;
  const svgH = totalH + 100;
  const fontSize = compact ? 11 : 13;

  type Edge = { from: any; to: any; topic: string; type: "pub"|"sub"; label?: string; color: string; animated: boolean };
  const edges: Edge[] = [];

  publishers.forEach((pub, pi) => {
    pub.writers.forEach((topic) => {
      const ti = topics.findIndex((t) => t.name === topic);
      if (ti === -1) return;
      const isIncompat = liveStats?.incompatible.has(`${pub.name}:${topic}`);
      const sentCount = liveStats?.sent[topic];
      edges.push({ from: { ...pubPositions[pi], w: NODE_W, h: NODE_H }, to: { ...topicPositions[ti], w: TOPIC_W, h: TOPIC_H }, topic, type: "pub", label: sentCount !== undefined ? `${sentCount} sent` : undefined, color: isIncompat ? "#ef4444" : "#3b82f6", animated: isRunning && !isIncompat });
    });
  });

  subscribers.forEach((sub, si) => {
    sub.readers.forEach((topic) => {
      const ti = topics.findIndex((t) => t.name === topic);
      if (ti === -1) return;
      const isIncompat = liveStats?.incompatible.has(`${sub.name}:${topic}`);
      const recvCount = liveStats?.received[topic];
      edges.push({ from: { ...topicPositions[ti], w: TOPIC_W, h: TOPIC_H }, to: { ...subPositions[si], w: NODE_W, h: NODE_H }, topic, type: "sub", label: recvCount !== undefined ? `${recvCount} recv` : undefined, color: isIncompat ? "#ef4444" : "#10b981", animated: isRunning && !isIncompat });
    });
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="xMidYMid meet" className="select-none">
      <defs>
        {[["blue","#3b82f6"],["green","#10b981"],["red","#ef4444"]].map(([id, fill]) => (
          <marker key={id} id={`arrow-${id}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill={fill} />
          </marker>
        ))}
      </defs>

      {!compact && (
        <>
          <text x={colX[0]+NODE_W/2} y={30} textAnchor="middle" fill="#6b7280" fontSize={11} fontWeight="600" letterSpacing="0.05em">PUBLISHERS</text>
          <text x={colX[1]+TOPIC_W/2} y={30} textAnchor="middle" fill="#6b7280" fontSize={11} fontWeight="600" letterSpacing="0.05em">TOPICS</text>
          <text x={colX[2]+NODE_W/2} y={30} textAnchor="middle" fill="#6b7280" fontSize={11} fontWeight="600" letterSpacing="0.05em">SUBSCRIBERS</text>
        </>
      )}

      {edges.map((edge, i) => {
        const x1 = edge.from.x + edge.from.w, y1 = edge.from.y + edge.from.h / 2;
        const x2 = edge.to.x, y2 = edge.to.y + edge.to.h / 2;
        const cx1 = x1 + (x2 - x1) * 0.4, cx2 = x1 + (x2 - x1) * 0.6;
        const markerId = edge.color === "#ef4444" ? "arrow-red" : edge.type === "pub" ? "arrow-blue" : "arrow-green";
        return (
          <g key={`edge-${i}`}>
            <path d={`M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}`} fill="none" stroke={edge.color} strokeWidth={compact ? 1.5 : 2} strokeOpacity={0.6} markerEnd={`url(#${markerId})`} strokeDasharray={edge.animated ? "6 4" : undefined}>
              {edge.animated && <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />}
            </path>
            {edge.label && !compact && (
              <text x={(x1+x2)/2} y={(y1+y2)/2-6} textAnchor="middle" fill={edge.color} fontSize={9} fontWeight="500">{edge.label}</text>
            )}
          </g>
        );
      })}

      {publishers.map((pub, i) => (
        <g key={`pub-${pub.name}`}>
          <rect x={pubPositions[i].x} y={pubPositions[i].y} width={NODE_W} height={NODE_H} rx={8} fill="#1e3a5f" stroke="#3b82f6" strokeWidth={1.5} />
          <text x={pubPositions[i].x+NODE_W/2} y={pubPositions[i].y+NODE_H/2+1} textAnchor="middle" dominantBaseline="middle" fill="#e2e8f0" fontSize={fontSize} fontWeight="600">
            {pub.name.length > 16 ? pub.name.slice(0,15)+"…" : pub.name}
          </text>
        </g>
      ))}

      {topics.map((topic, i) => {
        const fieldStr = topic.fields?.slice(0,3).map((f)=>f.name).join(", ");
        return (
          <g key={`topic-${topic.name}`}>
            <rect x={topicPositions[i].x} y={topicPositions[i].y} width={TOPIC_W} height={TOPIC_H} rx={6} fill="#1f2937" stroke="#4b5563" strokeWidth={1.5} />
            <text x={topicPositions[i].x+TOPIC_W/2} y={topicPositions[i].y+(fieldStr&&!compact?TOPIC_H/2-5:TOPIC_H/2+1)} textAnchor="middle" dominantBaseline="middle" fill="#d1d5db" fontSize={fontSize} fontWeight="600">{topic.name}</text>
            {fieldStr && !compact && <text x={topicPositions[i].x+TOPIC_W/2} y={topicPositions[i].y+TOPIC_H/2+8} textAnchor="middle" dominantBaseline="middle" fill="#6b7280" fontSize={8}>{fieldStr.length>22?fieldStr.slice(0,21)+"…":fieldStr}</text>}
          </g>
        );
      })}

      {subscribers.map((sub, i) => (
        <g key={`sub-${sub.name}`}>
          <rect x={subPositions[i].x} y={subPositions[i].y} width={NODE_W} height={NODE_H} rx={8} fill="#064e3b" stroke="#10b981" strokeWidth={1.5} />
          <text x={subPositions[i].x+NODE_W/2} y={subPositions[i].y+NODE_H/2+1} textAnchor="middle" dominantBaseline="middle" fill="#e2e8f0" fontSize={fontSize} fontWeight="600">
            {sub.name.length > 16 ? sub.name.slice(0,15)+"…" : sub.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function buildLiveStats(events: Record<string, any>[]): LiveStats {
  const sent: Record<string, number> = {};
  const received: Record<string, number> = {};
  const incompatible = new Set<string>();
  const matched = new Set<string>();

  for (const e of events) {
    const { topic, category: cat } = e;
    if (cat === "message_sent" && topic) sent[topic] = (sent[topic] ?? 0) + 1;
    else if (cat === "message_received" && topic) received[topic] = (received[topic] ?? 0) + 1;
    else if ((cat === "incompatible_qos_offered" || cat === "incompatible_qos_requested") && topic) {
      if (e.participant) incompatible.add(`${e.participant}:${topic}`);
      if (e.endpoint) incompatible.add(`${e.endpoint}:${topic}`);
    } else if ((cat === "subscription_matched" || cat === "publication_matched") && topic) {
      if (e.endpoint) matched.add(`${e.endpoint}:${topic}`);
    }
  }
  return { sent, received, incompatible, matched };
}
