import { RefreshCw, TriangleAlert } from 'lucide-react';
import { Button } from './button';

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="m-3 flex flex-col gap-2 rounded-md border border-red-900/40 bg-red-950/30 p-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-2">
        <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-red-300">{title}</p>
          <p className="text-[11px] text-red-400/80">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
