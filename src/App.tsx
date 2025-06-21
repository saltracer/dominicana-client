import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

// Layout
import Layout from '@/components/layout/Layout';

// Pages
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import PrayerLandingPage from '@/pages/PrayerLandingPage';
import StudyLandingPage from '@/pages/StudyLandingPage';
import CommunityLandingPage from '@/pages/CommunityLandingPage';
import PreachingLandingPage from '@/pages/PreachingLandingPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import SettingsPage from '@/pages/SettingsPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import NotFound from '@/pages/NotFound';
import RssRedirectPage from '@/pages/RssRedirectPage';

// Prayer Pages
import PrayerIndex from '@/pages/prayer/PrayerIndex';
import RosaryPage from '@/pages/prayer/RosaryPage';
import DivineOfficePage from '@/pages/prayer/DivineOfficePage';
import ComplinePage from '@/pages/prayer/ComplinePage';
import LectioDivinaPage from '@/pages/prayer/LectioDivinaPage';

// Study Pages
import StudyIndexPage from '@/pages/study/StudyIndexPage';
import DocumentsIndexPage from '@/pages/study/DocumentsIndexPage';
import DocumentViewPage from '@/pages/study/DocumentViewPage';
import SaintsIndexPage from '@/pages/study/SaintsIndexPage';
import SaintViewPage from '@/pages/study/SaintViewPage';

// Community Pages
import CommunityIndexPage from '@/pages/community/CommunityIndexPage';
import EventsIndexPage from '@/pages/community/EventsIndexPage';
import EventViewPage from '@/pages/community/EventViewPage';
import DirectoryIndexPage from '@/pages/community/DirectoryIndexPage';

// Preaching Pages
import PreachingIndexPage from '@/pages/preaching/PreachingIndexPage';
import BlogIndexPage from '@/pages/preaching/BlogIndexPage';
import BlogPostViewPage from '@/pages/preaching/BlogPostViewPage';

// Admin Pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminBlogPostsPage from '@/pages/admin/AdminBlogPostsPage';
import AdminBlogPostEditPage from '@/pages/admin/AdminBlogPostEditPage';
import AdminDocumentsPage from '@/pages/admin/AdminDocumentsPage';
import AdminDocumentEditPage from '@/pages/admin/AdminDocumentEditPage';
import AdminEventsPage from '@/pages/admin/AdminEventsPage';
import AdminEventEditPage from '@/pages/admin/AdminEventEditPage';
import AdminSaintsPage from '@/pages/admin/AdminSaintsPage';
import AdminSaintEditPage from '@/pages/admin/AdminSaintEditPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClient client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/prayer" element={<PrayerLandingPage />} />
            <Route path="/study" element={<StudyLandingPage />} />
            <Route path="/community" element={<CommunityLandingPage />} />
            <Route path="/preaching" element={<PreachingLandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Prayer Routes */}
            <Route path="/prayer/index" element={<PrayerIndex />} />
            <Route path="/prayer/rosary" element={<RosaryPage />} />
            <Route path="/prayer/divine-office" element={<DivineOfficePage />} />
            <Route path="/prayer/compline" element={<ComplinePage />} />
            <Route path="/prayer/lectio-divina" element={<LectioDivinaPage />} />

            {/* Study Routes */}
            <Route path="/study/index" element={<StudyIndexPage />} />
            <Route path="/study/documents" element={<DocumentsIndexPage />} />
            <Route path="/study/documents/:documentId" element={<DocumentViewPage />} />
            <Route path="/study/saints" element={<SaintsIndexPage />} />
            <Route path="/study/saints/:saintId" element={<SaintViewPage />} />

            {/* Community Routes */}
            <Route path="/community/index" element={<CommunityIndexPage />} />
            <Route path="/community/events" element={<EventsIndexPage />} />
            <Route path="/community/events/:eventId" element={<EventViewPage />} />
            <Route path="/community/directory" element={<DirectoryIndexPage />} />

            {/* Preaching Routes */}
            <Route path="/preaching/index" element={<PreachingIndexPage />} />
            <Route path="/preaching/blog" element={<BlogIndexPage />} />
            <Route path="/preaching/blog/:slug" element={<BlogPostViewPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/blog-posts" element={<AdminBlogPostsPage />} />
            <Route path="/admin/blog-posts/edit/:blogPostId" element={<AdminBlogPostEditPage />} />
            <Route path="/admin/documents" element={<AdminDocumentsPage />} />
            <Route path="/admin/documents/edit/:documentId" element={<AdminDocumentEditPage />} />
            <Route path="/admin/events" element={<AdminEventsPage />} />
            <Route path="/admin/events/edit/:eventId" element={<AdminEventEditPage />} />
            <Route path="/admin/saints" element={<AdminSaintsPage />} />
            <Route path="/admin/saints/edit/:saintId" element={<AdminSaintEditPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            
            {/* RSS Feed Route */}
            <Route path="/rss" element={<RssRedirectPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
