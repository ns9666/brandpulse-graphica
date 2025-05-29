
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public home page */}
      <Route path="/home" element={<Home />} />
      
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/mentions" element={<ProtectedRoute><Mentions /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/competitor-analysis" element={<ProtectedRoute><CompetitorAnalysis /></ProtectedRoute>} />
      <Route path="/social-listening" element={<ProtectedRoute><SocialListening /></ProtectedRoute>} />
      <Route path="/dashboards" element={<ProtectedRoute><Dashboards /></ProtectedRoute>} />
      <Route path="/create-dashboard" element={<ProtectedRoute><CreateDashboard /></ProtectedRoute>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
