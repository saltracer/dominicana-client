
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

// Preaching Pages
import BlogIndexPage from '@/pages/preaching/BlogIndexPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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

            {/* Preaching Routes */}
            <Route path="/preaching/blog" element={<BlogIndexPage />} />
            
            {/* RSS Feed Route */}
            <Route path="/rss" element={<RssRedirectPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
