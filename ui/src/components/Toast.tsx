

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType; }
interface ToastContextValue { toast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm font-['Heebo']">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };
const COLORS = {
  success: "bg-emerald-950/95 border-emerald-500/30 text-emerald-200 shadow-emerald-950/20",
  error: "bg-rose-950/95 border-rose-500/30 text-rose-200 shadow-rose-950/20",
  info: "bg-slate-900/95 border-slate-700 text-slate-200 shadow-slate-950/40",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = ICONS[toast.type];

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-2 ${COLORS[toast.type]}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span className="text-sm font-medium flex-1 leading-snug">{toast.message}</span>
      <button onClick={onDismiss} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity p-0.5 hover:bg-white/5 rounded">
        <X size={14} />
      </button>
    </div>
  );
}