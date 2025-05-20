
import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from "../auth/UserMenu";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-semibold text-dominican-burgundy font-garamond">
          Dominicana
        </Link>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/prayer/liturgy-of-the-hours" className="hover:text-dominican-gold transition-colors">Prayer</Link>
          <Link to="/study/library" className="hover:text-dominican-gold transition-colors">Study</Link>
          <Link to="/community/liturgical-calendar" className="hover:text-dominican-gold transition-colors">Community</Link>
          <Link to="/preaching/daily-reflections" className="hover:text-dominican-gold transition-colors">Preaching</Link>
        </nav>
        
        {/* Add UserMenu to the right side of the header */}
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
