import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DrawerMenu from '../components/DrawerMenu';
import NavigationBar from '../components/NavigationBar';
import ResponsiveTest from '../components/ResponsiveTest';
import {
  UserIcon,
  LockClosedIcon,
  TrashIcon,
  InformationCircleIcon,
  BriefcaseIcon,
  CameraIcon,
  UsersIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/sign-in');
  };

  const menuItemsAccount = [
    { label: 'Edit profile', icon: UserIcon, onClick: () => {} },
    { label: 'Change Email', icon: LockClosedIcon, onClick: () => {} },
    { label: 'Change Password', icon: LockClosedIcon, onClick: () => {} },
    { label: 'Email VisaConnect', icon: EnvelopeIcon, onClick: () => {} },
    { label: 'Logout', icon: ArrowLeftOnRectangleIcon, onClick: handleLogout },
    {
      label: 'Delete account',
      icon: TrashIcon,
      onClick: () => {},
      danger: true,
    },
  ];

  const menuItemsPreferences = [
    {
      label: 'Preferences',
      icon: InformationCircleIcon,
      onClick: () => {},
    },
    { label: 'Jobs applied to', icon: BriefcaseIcon, onClick: () => {} },
    {
      label: 'Jobs posted (only for approved employers)',
      icon: CameraIcon,
      onClick: () => {},
    },
    { label: 'Meetups posted', icon: CameraIcon, onClick: () => {} },
    {
      label: "Meetups I'm interested in",
      icon: ArrowRightIcon,
      onClick: () => {},
    },
  ];

  const handleMenuClick = () => setMenuOpen(true);
  const handleOverlayClick = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <DrawerMenu
        open={menuOpen}
        onClose={handleOverlayClick}
        navigate={navigate}
        highlight="settings"
      />

      {/* Shared Navigation Bar */}
      <NavigationBar currentPage="settings" onMenuClick={handleMenuClick} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Account Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Account
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {menuItemsAccount.map((item, idx) => {
                const isLogout = item.label === 'Logout';
                return (
                  <button
                    key={item.label}
                    className={`flex items-center w-full px-4 py-4 text-left gap-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                      item.danger
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-800 hover:bg-gray-50'
                    } ${
                      !isLogout
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                    onClick={isLogout ? item.onClick : undefined}
                    disabled={!isLogout}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        item.danger ? 'text-red-500' : 'text-gray-400'
                      }`}
                    />
                    <span className="flex-1 text-base font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferences Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Preferences
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {menuItemsPreferences.map((item, idx) => (
                <button
                  key={item.label}
                  className="flex items-center w-full px-4 py-4 text-left gap-3 border-b border-gray-100 last:border-b-0 text-gray-800 opacity-50 cursor-not-allowed transition-colors"
                  disabled
                >
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <span className="flex-1 text-base font-medium">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Test Component */}
      <ResponsiveTest />
    </div>
  );
};

export default SettingsScreen;
