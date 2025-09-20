import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Influencers from "./pages/Influencers";
import Campaigns from "./pages/Campaigns";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInfluencers from "./pages/AdminInfluencers";
import AdminImport from "./pages/AdminImport";
import AdminAddInfluencer from "./pages/AdminAddInfluencer";
import AdminLayout from "./components/AdminLayout";
import BillingPage from "./pages/Billing";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";
import ContactInfluencer from "./pages/ContactInfluencer";
import Contact from "./pages/Contact";
import Support from "./pages/Support";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/discover" 
              element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencers" 
              element={
                <ProtectedRoute>
                  <Influencers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contact/:influencerId" 
              element={
                <ProtectedRoute>
                  <ContactInfluencer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/campaigns" 
              element={
                <ProtectedRoute>
                  <Campaigns />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/billing" 
              element={
                <ProtectedRoute>
                  <BillingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/help" 
              element={
                <ProtectedRoute>
                  <HelpSupport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contact" 
              element={<Contact />} 
            />
            <Route 
              path="/support" 
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              } 
            />
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/influencers" 
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminInfluencers />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/import" 
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminImport />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/influencers/add" 
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminAddInfluencer />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
