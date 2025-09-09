import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart as ChartBar, Home, Heart, Briefcase, Newspaper, LogOut, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavigationProps {
  restrictedAccess?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ restrictedAccess = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleNavigation = (path: string, requiresAuth: boolean = true) => {
    if (requiresAuth && (!user || restrictedAccess)) {
      // Show tooltip or alert that access is restricted
      return;
    }
    navigate(path);
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/dashboard/watchlist', icon: Heart, label: 'Watchlist' },
    { path: '/dashboard/portfolio', icon: Briefcase, label: 'Portfolio' },
    { path: '/dashboard/news', icon: Newspaper, label: 'News' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  const isDisabled = (requiresAuth: boolean = true) => {
    return requiresAuth && (!user || restrictedAccess);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-800 via-blue-800 to-slate-700 text-white shadow-xl border-b border-slate-600/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <ChartBar className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-wide">StockWise</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path, path !== '/dashboard')}
                disabled={isDisabled(path !== '/dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 relative ${
                  isDisabled(path !== '/dashboard')
                    ? 'opacity-50 cursor-not-allowed bg-slate-700/50'
                    : isActive(path)
                    ? 'bg-white/20 shadow-lg font-semibold border border-white/30 hover:bg-white/30'
                    : 'hover:bg-white/20 hover:shadow-lg'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {isDisabled(path !== '/dashboard') && (
                  <Lock className="w-3 h-3 ml-1 opacity-70" />
                )}
              </button>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-600 hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-slate-600/50 py-3">
          <div className="flex justify-around items-center">
            {navItems.map(({ path, icon: Icon, label }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path, path !== '/dashboard')}
                disabled={isDisabled(path !== '/dashboard')}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                  isDisabled(path !== '/dashboard')
                    ? 'opacity-50 cursor-not-allowed text-slate-400'
                    : isActive(path)
                    ? 'bg-white/20 text-white'
                    : 'text-blue-200 hover:bg-white/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
                {isDisabled(path !== '/dashboard') && (
                  <Lock className="w-3 h-3 opacity-70" />
                )}
              </button>
            ))}
            
            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 text-red-300 hover:bg-red-600/20"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;