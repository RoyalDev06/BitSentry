import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Alerts from "./pages/Alerts/Alerts";
import Transactions from "./pages/Transactions/Transactions";
import Addresses from "./pages/Addresses/Addresses";
import Cases from "./pages/Cases/Cases";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/cases" element={<Cases />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
