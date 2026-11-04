import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./pages/Landing/LandingPage";
import Login from "./pages/Auth/Login";

import Dashboard from "./pages/Dashboard/Dashboard";
import Alerts from "./pages/Alerts/Alerts";
import Transactions from "./pages/Transactions/Transactions";
import Addresses from "./pages/Addresses/Addresses";
import Cases from "./pages/Cases/CasesPage";
import CaseDetailPage from "./pages/Cases/CaseDetailPage";
import Wallets from "./pages/Wallets/WalletsPage";
import AuditLog from "./pages/Audit/AuditLogPage";
import Users from "./pages/Users/UserManagementPage";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Navigate to="/login" replace />} />

        {/* Protected application */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:id" element={<CaseDetailPage />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
