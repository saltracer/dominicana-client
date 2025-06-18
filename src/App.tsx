
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from 'sonner';

// Import page components
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import SubscriptionPage from './pages/SubscriptionPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import SettingsPage from './pages/SettingsPage';

// Prayer Section Pages
import PrayerLandingPage from './pages/PrayerLandingPage';
import LiturgyOfHoursPage from './pages/prayer/LiturgyOfHoursPage';
import RosaryPage from './pages/prayer/RosaryPage';

// Study Section Pages
import StudyLandingPage from './pages/StudyLandingPage';
import LibraryPage from './pages/study/LibraryPage';
import BookPage from './pages/study/BookPage';

// Preaching Section Pages
import PreachingLandingPage from './pages/PreachingLandingPage';
import BlogIndexPage from './pages/preaching/BlogIndexPage';
import BlogPostPage from './pages/preaching/BlogPostPage';
import DailyReflectionsPage from './pages/preaching/DailyReflectionsPage';

// Community Section Pages
import CommunityLandingPage from './pages/CommunityLandingPage';
import LiturgicalCalendarPage from './pages/community/LiturgicalCalendarPage';
import SaintsPage from './pages/community/SaintsPage';
import ProvincesPage from './pages/community/ProvincesPage';

// Admin Pages
import AdminPanel from './pages/admin/AdminPanel';
import BlogAdminPage from './pages/admin/BlogAdminPage';
import BlogEditorPage from './pages/admin/BlogEditorPage';
import BlogEditPage from './pages/admin/BlogEditPage';
import NotFound from './pages/NotFound';
import BookAdminPage from './pages/admin/BookAdminPage';
import BookEditPage from './pages/admin/BookEditPage';
import UserAdminPage from './pages/admin/UserAdminPage';

// Authentication wrapper
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check if loading is complete before evaluating user
    if (!loading) {
      setChecked(true);
    }
  }, [user, loading]);

  if (!checked) {
    // Prevent rendering until loading is complete
    return null;
  }

  if (!user) {
    // Redirect to the /auth page
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster />
          <Routes>
            {/* Main Application Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />

            {/* Prayer Section Routes */}
            <Route path="/prayer" element={<PrayerLandingPage />} />
            <Route path="/prayer/liturgy-of-hours" element={<LiturgyOfHoursPage />} />
            <Route path="/prayer/rosary" element={<RosaryPage />} />

            {/* Study Section Routes */}
            <Route path="/study" element={<StudyLandingPage />} />
            <Route path="/study/library" element={<LibraryPage />} />
            <Route path="/study/books/:id" element={<BookPage />} />

            {/* Preaching Section Routes */}
            <Route path="/preaching" element={<PreachingLandingPage />} />
            <Route path="/preaching/blog" element={<BlogIndexPage />} />
            <Route path="/preaching/blog/:slug" element={<BlogPostPage />} />
            <Route path="/preaching/daily-reflections" element={<DailyReflectionsPage />} />

            {/* Community Section Routes */}
            <Route path="/community" element={<CommunityLandingPage />} />
            <Route path="/community/calendar" element={<LiturgicalCalendarPage />} />
            <Route path="/community/saints" element={<SaintsPage />} />
            <Route path="/community/provinces" element={<ProvincesPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/blog" element={<BlogAdminPage />} />
            <Route path="/admin/blog/new" element={<BlogEditorPage />} />
            <Route path="/admin/blog/edit/:id" element={<BlogEditPage />} />
            <Route path="/admin/books" element={<BookAdminPage />} />
            <Route path="/admin/books/edit/:id" element={<BookEditPage />} />
            <Route path="/admin/users" element={<UserAdminPage />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
