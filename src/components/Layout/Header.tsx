import React, { useState, useEffect } from 'react';
import { Menu, X, UserCircle, Bell, BarChart2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled 
        ? 'bg-white shadow-sm py-2' 
        : 'bg-transparent py-4'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 
              className="h-6 w-6 text-primary-600" 
              strokeWidth={2.5} 
            />
            <h1 className={`text-xl font-semibold ${isScrolled ? 'text-primary-700' : 'text-primary-600'}`}>
              AirVision
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium hover:text-primary-600 transition-colors 
              ${isScrolled ? 'text-neutral-700' : 'text-neutral-600'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/map" 
              className={`text-sm font-medium hover:text-primary-600 transition-colors 
              ${isScrolled ? 'text-neutral-700' : 'text-neutral-600'}`}
            >
              Map View
            </Link>
            <Link 
              to="/history" 
              className={`text-sm font-medium hover:text-primary-600 transition-colors 
              ${isScrolled ? 'text-neutral-700' : 'text-neutral-600'}`}
            >
              Historical Data
            </Link>
            <Link 
              to="/insights" 
              className={`text-sm font-medium hover:text-primary-600 transition-colors 
              ${isScrolled ? 'text-neutral-700' : 'text-neutral-600'}`}
            >
              Insights
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              className={`p-2 rounded-full hover:bg-neutral-100 transition-colors 
              ${isScrolled ? 'text-neutral-700' : 'text-neutral-600'}`}
            >
              <Bell size={20} />
            </button>
            <button 
              className={`p-2 rounded-full hover:bg-neutral-100 transition-colors 
              ${isScrolled ? 'text-neutral-700' : 'text-neutral-600'}`}
            >
              <Settings size={20} />
            </button>
            <button 
              className={`p-2 rounded-full hover:bg-neutral-100 transition-colors 
              ${isScrolled ? 'text-neutral-700' : 'text-neutral-600'}`}
            >
              <UserCircle size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-neutral-700" />
            ) : (
              <Menu size={24} className={`${isScrolled ? 'text-neutral-700' : 'text-neutral-600'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 shadow-lg animate-slide-down">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="text-neutral-700 font-medium py-2 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/map" 
                className="text-neutral-700 font-medium py-2 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Map View
              </Link>
              <Link 
                to="/history" 
                className="text-neutral-700 font-medium py-2 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Historical Data
              </Link>
              <Link 
                to="/insights" 
                className="text-neutral-700 font-medium py-2 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Insights
              </Link>
              <div className="flex gap-4 py-2 border-t border-neutral-100 mt-2">
                <button className="text-neutral-700 hover:text-primary-600 transition-colors">
                  <Bell size={20} />
                </button>
                <button className="text-neutral-700 hover:text-primary-600 transition-colors">
                  <Settings size={20} />
                </button>
                <button className="text-neutral-700 hover:text-primary-600 transition-colors">
                  <UserCircle size={20} />
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;