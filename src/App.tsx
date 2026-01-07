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
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
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

// Phase 4 Pages
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import SalesPipeline from "./pages/sales/SalesPipeline";
import CRMDashboard from "./pages/crm/CRMDashboard";
import InventoryDashboard from "./pages/inventory/InventoryDashboard";
import ProcurementManagement from "./pages/procurement/ProcurementManagement";
import PaymentsPage from "./pages/payments/PaymentsPage";
import InvoicingPage from "./pages/invoicing/InvoicingPage";
import ContactPage from "./pages/public/ContactPage";
import BookServicePage from "./pages/public/BookServicePage";
import ReviewsPage from "./pages/public/ReviewsPage";
import HelpCenterPage from "./pages/public/HelpCenterPage";

// Phase 5 Admin Pages
import UserManagement from "./pages/admin/UserManagement";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import ApiKeysManagement from "./pages/admin/ApiKeysManagement";
import AccountSettings from "./pages/settings/AccountSettings";

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
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/book-service" element={<BookServicePage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
            </Route>

            {/* Auth routes */}
            <Route path="/login" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />

            {/* Protected routes */}
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
              
              {/* Analytics */}
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              
              {/* Sales & CRM */}
              <Route path="/sales" element={<SalesPipeline />} />
              <Route path="/crm" element={<CRMDashboard />} />
              
              {/* Inventory & Procurement */}
              <Route path="/inventory" element={<InventoryDashboard />} />
              <Route path="/procurement" element={<ProcurementManagement />} />
              
              {/* Financial */}
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/invoicing" element={<InvoicingPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><DepartmentManagement /></ProtectedRoute>} />
              <Route path="/admin/api-keys" element={<ProtectedRoute allowedRoles={['admin']}><ApiKeysManagement /></ProtectedRoute>} />
              
              {/* Settings */}
              <Route path="/settings" element={<AccountSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
