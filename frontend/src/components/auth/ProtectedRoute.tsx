import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getAuthToken, USE_MOCKS } from "../../services/api";

function ProtectedRoute() {
  if (USE_MOCKS) return <Outlet />;
  if (!getAuthToken()) return <Navigate to="/login" replace />;
  return <SessionGate />;
}

// Confirms the stored token is still valid before rendering the app.
// A 401 clears the token and redirects to /login inside the API client.
function SessionGate() {
  const { isPending, isError, error, refetch } = useCurrentUser();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 bg-background text-sm text-text-secondary">
        <Loader2 size={16} className="animate-spin" />
        Checking your session...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <p className="text-sm font-medium text-text-primary">
          Could not reach the BitSentry API
        </p>
        <p className="max-w-md text-xs text-text-secondary">
          {error instanceof Error ? error.message : "Unknown error"}. Make sure
          the backend is running and VITE_API_BASE_URL points to it.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg bg-brand-teal px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
