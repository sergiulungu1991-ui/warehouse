'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Check, RefreshCw, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastTone = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  tone: ToastTone;
  message: string;
};

const TONE_STYLES: Record<ToastTone, { className: string; icon: LucideIcon }> = {
  success: {
    className: 'border-accent/40 bg-accent-surface text-accent-text',
    icon: Check,
  },
  error: {
    className: 'border-red-900/50 bg-red-950/70 text-red-300',
    icon: TriangleAlert,
  },
  info: {
    className: 'border-line bg-surface-300 text-fg',
    icon: RefreshCw,
  },
};

const AUTO_DISMISS_MS = 4000;

type ToastContextValue = {
  toast: (tone: ToastTone, message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback(
    (id: number) => setToasts((prev) => prev.filter((item) => item.id !== id)),
    [],
  );

  const toast = useCallback(
    (tone: ToastTone, message: string) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, tone, message }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-3 right-3 z-100 flex w-[calc(100vw-1.5rem)] max-w-xs flex-col gap-1.5"
      >
        {toasts.map((item) => {
          const ToneIcon = TONE_STYLES[item.tone].icon;
          return (
            <div
              key={item.id}
              className={cn(
                'pointer-events-auto flex items-start gap-2 rounded-md border px-2.5 py-2 shadow-lg shadow-black/30',
                TONE_STYLES[item.tone].className,
              )}
              style={{ animation: 'toast-in 200ms ease-out' }}
            >
              <ToneIcon className="mt-px h-3.5 w-3.5 shrink-0" />
              <p className="flex-1 text-xs">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');

  return useMemo(
    () => ({
      success: (message: string) => context.toast('success', message),
      error: (message: string) => context.toast('error', message),
      info: (message: string) => context.toast('info', message),
    }),
    [context],
  );
}
