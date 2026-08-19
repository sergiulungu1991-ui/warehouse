'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type PendingConfirm = ConfirmOptions & { resolve: (confirmed: boolean) => void };

const ConfirmContext = createContext<((options: ConfirmOptions) => Promise<boolean>) | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setPending({ ...options, resolve })),
    [],
  );

  const close = useCallback(
    (confirmed: boolean) => {
      pending?.resolve(confirmed);
      setPending(null);
    },
    [pending],
  );

  useEffect(() => {
    if (!pending) return;
    confirmButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pending, close]);

  return (
    <ConfirmContext value={confirm}>
      {children}
      {pending && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => close(false)}
        >
          <div
            role="alertdialog"
            aria-modal
            aria-labelledby="confirm-title"
            onClick={(event) => event.stopPropagation()}
            style={{ animation: 'dialog-in 150ms ease-out' }}
            className="w-full max-w-sm rounded-md border border-line bg-surface-200 p-4 shadow-xl shadow-black/40"
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border',
                  pending.destructive
                    ? 'border-red-900/40 bg-red-950/40 text-red-400'
                    : 'border-line bg-surface-300 text-fg-muted',
                )}
              >
                <TriangleAlert className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <h2 id="confirm-title" className="text-xs font-medium text-fg">
                  {pending.title}
                </h2>
                {pending.description && (
                  <p className="mt-0.5 text-[11px] text-fg-muted">{pending.description}</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-1.5">
              <Button variant="secondary" size="sm" onClick={() => close(false)}>
                {pending.cancelLabel ?? 'Cancel'}
              </Button>
              <Button
                ref={confirmButtonRef}
                size="sm"
                variant={pending.destructive ? 'danger' : 'primary'}
                onClick={() => close(true)}
              >
                {pending.confirmLabel ?? 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext>
  );
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm must be used inside <ConfirmProvider>');
  return confirm;
}

/** Convenience wrapper for the most common case: deleting a record */
export function useConfirmDelete() {
  const confirm = useConfirm();
  return useMemo(
    () => (entity: string) =>
      confirm({
        title: `Delete ${entity}?`,
        description: 'This action cannot be undone.',
        confirmLabel: 'Delete',
        destructive: true,
      }),
    [confirm],
  );
}
