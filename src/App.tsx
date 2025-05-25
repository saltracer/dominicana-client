
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { LiturgicalDayProvider } from "./context/LiturgicalDayContext";
import AuthPage from "./pages/AuthPage";
import RequireAuth from "./components/auth/RequireAuth";
import RoleGuard from "./components/auth/RoleGuard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import AdminPanel from "./pages/admin/AdminPanel";
import SettingsPage from "./pages/SettingsPage";

// Prayer Pages
import LiturgyOfHoursPage from "./pages/prayer/LiturgyOfHoursPage";
import RosaryPage from "./pages/prayer/RosaryPage";

// Study Pages
import LibraryPage from "./pages/study/LibraryPage";
import BookPage from "./pages/study/BookPage";

// Community Pages
import LiturgicalCalendarPage from "./pages/community/LiturgicalCalendarPage";
import SaintsPage from "./pages/community/SaintsPage";
import ProvincesPage from "./pages/community/ProvincesPage";

// Preaching Pages
import DailyReflectionsPage from "./pages/preaching/DailyReflectionsPage";

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LiturgicalDayProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  
                  {/* Settings Route - Requires Authentication */}
                  <Route path="/settings" element={
                    <RoleGuard requiredRole="authenticated" fallbackPath="/auth">
                      <SettingsPage />
                    </RoleGuard>
                  } />
                  
                  {/* Prayer Routes - Free User Access to Pages, Authentication for Features */}
                  <Route path="/prayer/liturgy-of-the-hours" element={
                    <RoleGuard requiredRole="free">
                      <LiturgyOfHoursPage />
                    </RoleGuard>
                  } />
                  <Route path="/prayer/rosary" element={
                    <RoleGuard requiredRole="free">
                      <RosaryPage />
                    </RoleGuard>
                  } />
                  
                  {/* Study Routes - Library browsing is free, reading books requires auth */}
                  <Route path="/study/library" element={
                    <RoleGuard requiredRole="free">
                      <LibraryPage />
                    </RoleGuard>
                  } />
                  <Route path="/books/:id" element={
                    <RoleGuard requiredRole="authenticated" fallbackPath="/auth">
                      <BookPage />
                    </RoleGuard>
                  } />
                  
                  {/* Community Routes - All community pages are public */}
                  <Route path="/community/liturgical-calendar" element={
                    <RoleGuard requiredRole="free">
                      <LiturgicalCalendarPage />
                    </RoleGuard>
                  } />
                  <Route path="/community/saints" element={
                    <RoleGuard requiredRole="free">
                      <SaintsPage />
                    </RoleGuard>
                  } />
                  <Route path="/community/provinces" element={
                    <RoleGuard requiredRole="free">
                      <ProvincesPage />
                    </RoleGuard>
                  } />
                  
                  {/* Preaching Routes */}
                  <Route path="/preaching/daily-reflections" element={
                    <RoleGuard requiredRole="free">
                      <DailyReflectionsPage />
                    </RoleGuard>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <RoleGuard requiredRole="admin" fallbackPath="/unauthorized">
                      <AdminPanel />
                    </RoleGuard>
                  } />
                  
                  {/* Add routes for books management and book editing */}
                  <Route path="/admin/books" element={
                    <RoleGuard requiredRole="admin" fallbackPath="/unauthorized">
                      <AdminPanel />
                    </RoleGuard>
                  } />
                  
                  <Route path="/admin/books/edit/:id" element={
                    <RoleGuard requiredRole="admin" fallbackPath="/unauthorized">
                      <AdminPanel />
                    </RoleGuard>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LiturgicalDayProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
