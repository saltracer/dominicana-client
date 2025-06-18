
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import RoleGuard from '@/components/auth/RoleGuard';

// Pages
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import AuthPage from '@/pages/AuthPage';
import SettingsPage from '@/pages/SettingsPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import NotFound from '@/pages/NotFound';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';

// Prayer Pages
import PrayerLandingPage from '@/pages/PrayerLandingPage';
import LiturgyOfHoursPage from '@/pages/prayer/LiturgyOfHoursPage';
import RosaryPage from '@/pages/prayer/RosaryPage';

// Study Pages  
import StudyLandingPage from '@/pages/StudyLandingPage';
import LibraryPage from '@/pages/study/LibraryPage';
import BookPage from '@/pages/study/BookPage';

// Preaching Pages
import PreachingLandingPage from '@/pages/PreachingLandingPage';
import DailyReflectionsPage from '@/pages/preaching/DailyReflectionsPage';
import BlogIndexPage from '@/pages/preaching/BlogIndexPage';
import BlogPostPage from '@/pages/preaching/BlogPostPage';

// Community Pages
import CommunityLandingPage from '@/pages/CommunityLandingPage';
import SaintsPage from '@/pages/community/SaintsPage';
import LiturgicalCalendarPage from '@/pages/community/LiturgicalCalendarPage';
import ProvincesPage from '@/pages/community/ProvincesPage';

// Admin Pages
import AdminPanel from '@/pages/admin/AdminPanel';
import BlogAdminPage from '@/pages/admin/BlogAdminPage';
import BlogEditorPage from '@/pages/admin/BlogEditorPage';
import BlogEditPage from '@/pages/admin/BlogEditPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Main Routes */}
            <Route index element={<Index />} />
            <Route path="home" element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-of-service" element={<TermsOfServicePage />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />

            {/* Authenticated Routes */}
            <Route 
              path="settings" 
              element={
                <RoleGuard requiredRole="authenticated">
                  <SettingsPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="subscription" 
              element={
                <RoleGuard requiredRole="authenticated">
                  <SubscriptionPage />
                </RoleGuard>
              } 
            />

            {/* Prayer Routes - Free Access */}
            <Route path="prayer" element={<PrayerLandingPage />} />
            <Route 
              path="prayer/liturgy-of-the-hours" 
              element={
                <RoleGuard requiredRole="free">
                  <LiturgyOfHoursPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="prayer/liturgy-of-the-hours/*" 
              element={
                <RoleGuard requiredRole="free">
                  <LiturgyOfHoursPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="prayer/rosary" 
              element={
                <RoleGuard requiredRole="free">
                  <RosaryPage />
                </RoleGuard>
              } 
            />

            {/* Study Routes */}
            <Route path="study" element={<StudyLandingPage />} />
            <Route 
              path="study/library" 
              element={
                <RoleGuard requiredRole="free">
                  <LibraryPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="study/book/:id" 
              element={
                <RoleGuard requiredRole="authenticated">
                  <BookPage />
                </RoleGuard>
              } 
            />

            {/* Preaching Routes */}
            <Route path="preaching" element={<PreachingLandingPage />} />
            <Route path="preaching/daily-reflections" element={<DailyReflectionsPage />} />
            <Route path="preaching/blog" element={<BlogIndexPage />} />
            <Route path="preaching/blog/:slug" element={<BlogPostPage />} />

            {/* Community Routes */}
            <Route path="community" element={<CommunityLandingPage />} />
            <Route path="community/saints" element={<SaintsPage />} />
            <Route path="community/saints/:saintId" element={<SaintsPage />} />
            <Route path="community/calendar" element={<LiturgicalCalendarPage />} />
            <Route path="community/liturgical-calendar" element={<LiturgicalCalendarPage />} />
            <Route path="community/provinces" element={<ProvincesPage />} />

            {/* Admin Routes */}
            <Route 
              path="admin" 
              element={
                <RoleGuard requiredRole="admin">
                  <AdminPanel />
                </RoleGuard>
              } 
            />
            <Route 
              path="admin/blog" 
              element={
                <RoleGuard requiredRole="admin">
                  <BlogAdminPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="admin/blog/new" 
              element={
                <RoleGuard requiredRole="admin">
                  <BlogEditorPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="admin/blog/edit/:id" 
              element={
                <RoleGuard requiredRole="admin">
                  <BlogEditPage />
                </RoleGuard>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
