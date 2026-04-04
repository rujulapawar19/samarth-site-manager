import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LaborPage from "./pages/LaborPage";
import AttendancePage from "./pages/AttendancePage";
import PaydayPage from "./pages/PaydayPage";
import MaterialsPage from "./pages/MaterialsPage";
import NewDeliveryPage from "./pages/NewDeliveryPage";
import SuppliersPage from "./pages/SuppliersPage";
import InvoicesPage from "./pages/InvoicesPage";
import FinancePage from "./pages/FinancePage";
import AlertsPage from "./pages/AlertsPage";
import NotFound from "./pages/NotFound";
import { ActivityProvider } from "./context/ActivityContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <ActivityProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/labor" element={<LaborPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/payday" element={<PaydayPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/new-delivery" element={<NewDeliveryPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/alerts" element={<AlertsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        </ActivityProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
