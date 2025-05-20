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
          <Link to="/prayer" className="hover:text-dominican-gold transition-colors">Prayer</Link>
          <Link to="/study" className="hover:text-dominican-gold transition-colors">Study</Link>
          <Link to="/community" className="hover:text-dominican-gold transition-colors">Community</Link>
          <Link to="/preaching" className="hover:text-dominican-gold transition-colors">Preaching</Link>
        </nav>
        
        {/* Add UserMenu to the right side of the header */}
        <div className="flex items-center space-x-4">
          {/* Navigation Links (visible on smaller screens) */}
          <nav className="md:hidden">
            <Link to="/menu" className="hover:text-dominican-gold transition-colors">Menu</Link>
          </nav>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
