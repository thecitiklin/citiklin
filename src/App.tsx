import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import DashboardRedirect from "./pages/DashboardRedirect";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ManagerDashboard from "./pages/dashboards/ManagerDashboard";
import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";

// Phase 3 Pages
import ProjectsList from "./pages/projects/ProjectsList";
import ProjectDetails from "./pages/projects/ProjectDetails";
import TaskManagement from "./pages/projects/TaskManagement";
import CustomersList from "./pages/customers/CustomersList";
import CustomerProfile from "./pages/customers/CustomerProfile";
import CustomerSupport from "./pages/support/CustomerSupport";
import FleetOverview from "./pages/fleet/FleetOverview";
import VehicleDetails from "./pages/fleet/VehicleDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
            </Route>

            {/* Auth routes (no layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes with app layout */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/manager" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><ManagerDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/employee" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'employee']}><EmployeeDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/customer" element={<ProtectedRoute allowedRoles={['admin', 'customer']}><CustomerDashboard /></ProtectedRoute>} />
              
              {/* Projects */}
              <Route path="/projects" element={<ProjectsList />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/projects/:id/tasks" element={<TaskManagement />} />
              
              {/* Customers */}
              <Route path="/customers" element={<CustomersList />} />
              <Route path="/customers/:id" element={<CustomerProfile />} />
              <Route path="/support" element={<CustomerSupport />} />
              
              {/* Fleet */}
              <Route path="/fleet" element={<FleetOverview />} />
              <Route path="/fleet/:id" element={<VehicleDetails />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
