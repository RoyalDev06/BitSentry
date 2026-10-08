import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import Dashboard from "./pages/Dashboard/Dashboard";
import Alerts from "./pages/Alerts/Alerts";
import Transactions from "./pages/Transactions/Transactions";
import Addresses from "./pages/Addresses/Addresses";
import Cases from "./pages/Cases/CasesPage";
import CaseDetailPage from "./pages/Cases/CaseDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication pages — no dashboard layout */}
       <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />

        {/* Application pages — use dashboard layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
