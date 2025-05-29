import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserMenu from "../auth/UserMenu";
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeSelector } from '@/components/ui/theme-selector';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MenuItem {
  title: string;
  path: string;
  submenu?: Array<{
    title: string;
    path: string;
  }>;
}

const mainMenu: MenuItem[] = [
  {
    title: 'Prayer',
    path: '/prayer',
    submenu: [
      { title: 'Liturgy of the Hours', path: '/prayer/liturgy-of-the-hours' },
      { title: 'Rosary', path: '/prayer/rosary' },
    ],
  },
  {
    title: 'Study',
    path: '/study',
    submenu: [
      { title: 'Library', path: '/study/library' },
    ],
  },
  {
    title: 'Community',
    path: '/community',
    submenu: [
      { title: 'Liturgical Calendar', path: '/community/liturgical-calendar' },
      { title: 'Saints', path: '/community/saints' },
      { title: 'Provinces', path: '/community/provinces' },
    ],
  },
  {
    title: 'Preaching',
    path: '/preaching',
    submenu: [
      { title: 'Daily Reflections', path: '/preaching/daily-reflections' },
    ],
  },
];

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="bg-white dark:bg-card border-b border-dominican-light-gray dark:border-border shadow-sm relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-dominican-burgundy font-garamond text-2xl font-bold">Dominicana</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {mainMenu.map((item) => (
              <div key={item.title} className="relative group">
                {item.submenu ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center text-foreground hover:text-dominican-burgundy font-medium">
                        {item.title}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0" align="center">
                      <div className="bg-white shadow-md rounded py-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="block px-4 py-2 text-sm hover:bg-dominican-light-gray hover:text-dominican-burgundy"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Link
                    to={item.path}
                    className="text-foreground hover:text-dominican-burgundy font-medium"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            
            <div className="flex items-center space-x-2">
              <ThemeSelector />
              <UserMenu />
            </div>
          </nav>

          {/* Mobile Menu Controls */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeSelector />
            <UserMenu />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-dominican-black hover:text-dominican-burgundy"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "absolute top-16 left-0 right-0 bg-white shadow-md z-20 transition-all duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0 overflow-hidden"
        )}
      >
        <div className="container mx-auto px-4 py-2">
          {mainMenu.map((item) => (
            <div key={item.path} className="py-2">
              {item.submenu ? (
                <>
                  <div className="font-medium text-dominican-black py-2">
                    {item.title}
                  </div>
                  <div className="pl-4 border-l-2 border-dominican-light-gray space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="block py-2 text-muted-foreground hover:text-dominican-burgundy"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.path}
                  className="block font-medium text-dominican-black hover:text-dominican-burgundy"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
