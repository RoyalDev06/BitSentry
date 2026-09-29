import { AlertCircle, Inbox, Loader2 } from "lucide-react";

interface StateViewProps {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
}

export default function StateView({
  isLoading,
  isError,
  isEmpty,
  emptyMessage = "Nothing to show yet.",
  onRetry,
}: StateViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-text-muted">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <AlertCircle className="h-6 w-6 text-risk-critical" />
        <p className="text-sm text-text-secondary">
          Could not load this section.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md border border-border-subtle bg-background-hover px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-background-hover"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <Inbox className="h-6 w-6 text-text-muted" />
        <p className="text-sm text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return null;
}
