// import { CheckCircle2, XCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";

// const STATUS_STYLES: Record<string, { bg: string; text: string; icon: any }> = {
//   passed: { bg: "bg-emerald-900/40 border border-emerald-700/30", text: "text-emerald-400", icon: CheckCircle2 },
//   failed: { bg: "bg-red-900/40 border border-red-700/30", text: "text-red-400", icon: XCircle },
//   error: { bg: "bg-red-900/40 border border-red-700/30", text: "text-red-400", icon: AlertTriangle },
//   timeout: { bg: "bg-amber-900/40 border border-amber-700/30", text: "text-amber-400", icon: Clock },
//   running: { bg: "bg-blue-900/40 border border-blue-700/30", text: "text-blue-300", icon: Loader2 },
//   pending: { bg: "bg-gray-800 border border-gray-600/30", text: "text-gray-300", icon: Clock },
// };

// export default function StatusBadge({ status, size = "sm" }: { status: string; size?: "sm" | "lg" }) {
//   const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
//   const Icon = style.icon;
//   const isRunning = status === "running";
//   const textSize = size === "lg" ? "text-sm font-semibold" : "text-xs font-medium";
//   const iconSize = size === "lg" ? 16 : 13;
//   const px = size === "lg" ? "px-3 py-1.5" : "px-2 py-0.5";

//   return (
//     <span className={`inline-flex items-center gap-1.5 rounded-full ${style.bg} ${style.text} ${textSize} ${px}`}>
//       <Icon size={iconSize} className={isRunning ? "animate-spin" : ""} />
//       {status.toUpperCase()}
//     </span>
//   );
// }

import { CheckCircle2, XCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";

// עדכון צבעים לשפה עיצובית בהירה, נקייה ויוקרתית התואמת לפיגמה
const STATUS_STYLES: Record<string, { bg: string; text: string; icon: any }> = {
  passed: { 
    bg: "bg-[#E2F0D9] border border-[#B4C6E7]/20", 
    text: "text-[#385723]", 
    icon: CheckCircle2 
  },
  failed: { 
    bg: "bg-[#FCE4D6] border border-[#F8CBAD]/30", 
    text: "text-[#C65911]", 
    icon: XCircle 
  },
  error: { 
    bg: "bg-[#FFF2CC] border border-[#FFE699]/30", 
    text: "text-[#7F6000]", 
    icon: AlertTriangle 
  },
  timeout: { 
    bg: "bg-[#EDEDED] border border-[#D9D9D9]/30", 
    text: "text-[#595959]", 
    icon: Clock 
  },
  running: { 
    bg: "bg-blue-50 border border-blue-200/50", 
    text: "text-blue-600", 
    icon: Loader2 
  },
  pending: { 
    bg: "bg-slate-50 border border-slate-200/50", 
    text: "text-slate-400", 
    icon: Clock 
  },
};

export default function StatusBadge({ status, size = "sm" }: { status: string; size?: "sm" | "lg" }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  const Icon = style.icon;
  const isRunning = status === "running";
  
  // שימוש בפונט heebo החדש שלנו מהקונפיגורציה
  const textSize = size === "lg" ? "text-xs font-black tracking-wider font-heebo" : "text-[10px] font-black tracking-wider font-heebo";
  const iconSize = size === "lg" ? 14 : 12;
  const px = size === "lg" ? "px-3.5 py-1.5" : "px-2.5 py-1";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${style.bg} ${style.text} ${textSize} ${px} transition-all`}>
      <Icon size={iconSize} className={isRunning ? "animate-spin" : ""} />
      {status.toUpperCase()}
    </span>
  );
}
