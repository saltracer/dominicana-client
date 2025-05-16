
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dominican-black text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-garamond text-xl font-semibold mb-4">Dominicana</h3>
            <p className="text-sm text-gray-300">
              A digital resource for the Order of Preachers, supporting prayer, study, community, and preaching.
            </p>
          </div>
          
          <div>
            <h4 className="font-garamond text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/prayer" className="hover:text-dominican-gold transition-colors">Prayer</Link></li>
              <li><Link to="/study" className="hover:text-dominican-gold transition-colors">Study</Link></li>
              <li><Link to="/community" className="hover:text-dominican-gold transition-colors">Community</Link></li>
              <li><Link to="/preaching" className="hover:text-dominican-gold transition-colors">Preaching</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-garamond text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-dominican-gold transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-dominican-gold transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-dominican-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-dominican-gold transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
          <div>
            &copy; {currentYear} Dominicana. All rights reserved.
          </div>
          <div className="mt-2 md:mt-0">
            <span className="inline-flex space-x-4">
              <a href="#" className="hover:text-dominican-gold transition-colors">Facebook</a>
              <a href="#" className="hover:text-dominican-gold transition-colors">Twitter</a>
              <a href="#" className="hover:text-dominican-gold transition-colors">Instagram</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
