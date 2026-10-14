import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  clearAuthToken,
  getAuthToken,
} from "../../services/api";
import { getCurrentUser } from "../../services/auth";

function ProtectedRoute() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setIsChecking(false);
      return;
    }

    getCurrentUser()
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        clearAuthToken();
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
