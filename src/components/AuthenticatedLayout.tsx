import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavigationBar from './NavigationBar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine current page based on pathname
  const getCurrentPage = (pathname: string): string => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname === '/settings') return 'settings';
    if (pathname === '/edit-profile') return 'settings';
    if (pathname.startsWith('/public-profile')) return 'dashboard';
    if (pathname === '/social') return 'social';
    if (pathname === '/connect') return 'social';
    if (pathname === '/chat') return 'chat';
    if (
      pathname === '/background' ||
      pathname === '/lifestyle' ||
      pathname === '/travel-exploration' ||
      pathname === '/knowledge-community'
    ) {
      return 'dashboard';
    }
    return 'dashboard';
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    // For now, just toggle menu state
    // TODO: Implement mobile menu functionality
  };

  const currentPage = getCurrentPage(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar currentPage={currentPage} onMenuClick={handleMenuClick} />
      {children}
    </div>
  );
};

export default AuthenticatedLayout;
