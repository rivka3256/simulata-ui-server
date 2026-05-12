import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { ToastProvider } from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import Profiles from "./pages/Profiles";
import Simulations from "./pages/Simulations";
import RunView from "./pages/RunView";
import History from "./pages/History";
import NewSimulation from "./pages/NewSimulation";

export default function App() {
  return (
    <ToastProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/simulations" element={<Simulations />} />
          {/* <Route path="/new-simulation" element={<NewSimulation />} />  */}
          <Route path="/new-simulation" element={<NewSimulation />} />
          <Route path="/edit-simulation/:id" element={<NewSimulation />} />
          <Route path="/run/:runId" element={<RunView />} />
          <Route path="/history" element={<History />} />
          <Route path="/scenarios" element={<Navigate to="/simulations" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
}
