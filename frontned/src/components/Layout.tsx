import React from 'react';
import { Recycle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showHeader = false }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {showHeader && user && (
        <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl">
                  <Recycle className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Ecofinder
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  Welcome, {user.name || 'User'}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className={showHeader ? 'pt-0' : ''}>
        <div className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;