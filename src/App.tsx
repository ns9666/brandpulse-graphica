
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Mentions from "./pages/Mentions";
import Analytics from "./pages/Analytics";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import SocialListening from "./pages/SocialListening";
import Dashboards from "./pages/Dashboards";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthLayout from "./components/layout/AuthLayout";
import CreateDashboard from "./pages/CreateDashboard";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Public route that redirects authenticated users to dashboards
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? <Navigate to="/dashboards" replace /> : <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public portal page - default landing */}
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      </Route>
      
      {/* Protected routes - require authentication */}
      <Route path="/dashboards" element={<ProtectedRoute><Dashboards /></ProtectedRoute>} />
      <Route path="/create-dashboard" element={<ProtectedRoute><CreateDashboard /></ProtectedRoute>} />
      
      {/* ALL Dashboard-specific routes wrapped with ONE DashboardProvider */}
      <Route path="/dashboard/:dashboardId/*" element={
        <ProtectedRoute>
          <DashboardProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mentions" element={<Mentions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
              <Route path="/social-listening" element={<SocialListening />} />
            </Routes>
          </DashboardProvider>
        </ProtectedRoute>
      } />
      
      {/* Legacy routes for compatibility */}
      <Route path="/mentions" element={<Navigate to="/dashboards" replace />} />
      <Route path="/analytics" element={<Navigate to="/dashboards" replace />} />
      <Route path="/competitor-analysis" element={<Navigate to="/dashboards" replace />} />
      <Route path="/social-listening" element={<Navigate to="/dashboards" replace />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
