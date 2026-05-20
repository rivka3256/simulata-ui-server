

import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

// במקום enum - משתמשים ב-const object עם טיפוס תואם
export const RunStatus = {
  PASSED: 'Passed',
  FAILED: 'Failed',
  IN_PROGRESS: 'In Progress'
} as const;

export type RunStatusType = typeof RunStatus[keyof typeof RunStatus];

const STATUS_STYLES: Record<RunStatusType, { bg: string; text: string; icon: any }> = {
  [RunStatus.PASSED]: {
    bg: "bg-emerald-950/40 border border-emerald-500/30",
    text: "text-emerald-400",
    icon: CheckCircle2,
  },
  [RunStatus.FAILED]: {
    bg: "bg-rose-950/40 border border-rose-500/30",
    text: "text-rose-400",
    icon: XCircle,
  },
  [RunStatus.IN_PROGRESS]: {
    bg: "bg-sky-950/40 border border-sky-500/30",
    text: "text-sky-400",
    icon: Loader2,
  }
};

function toRunStatus(raw: string): RunStatusType {
  if (!raw) return RunStatus.IN_PROGRESS;
  
  const normalized = raw.toLowerCase().trim();
  
  if (normalized === 'passed' || normalized === 'success') return RunStatus.PASSED;
  if (normalized === 'failed' || normalized === 'error' || normalized === 'stopped') return RunStatus.FAILED;
  
  return RunStatus.IN_PROGRESS;
}

export default function StatusBadge({ status, size = "sm" }: { status: string; size?: "sm" | "lg" }) {
  const normalized = toRunStatus(status);
  const style = STATUS_STYLES[normalized];
  const Icon = style.icon;
  const textSize = size === "lg" ? "text-[11px] font-black tracking-widest" : "text-[9px] font-black tracking-widest";
  const iconSize = size === "lg" ? 14 : 12;
  const px = size === "lg" ? "px-3 py-1" : "px-2.5 py-0.5";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full uppercase ${style.bg} ${style.text} ${textSize} ${px} transition-all shadow-inner`}>
      <Icon size={iconSize} className={normalized === RunStatus.IN_PROGRESS ? "animate-spin" : ""} />
      {normalized}
    </span>
  );
}