
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FeastBanner from '../feast/FeastBanner';
import { LiturgicalDayProvider } from '@/context/LiturgicalDayContext';
import { ThemeProvider } from '@/context/ThemeContext';

const Layout: React.FC = () => {
  return (
    <ThemeProvider>
      <LiturgicalDayProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <FeastBanner />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </LiturgicalDayProvider>
    </ThemeProvider>
  );
};

export default Layout;
