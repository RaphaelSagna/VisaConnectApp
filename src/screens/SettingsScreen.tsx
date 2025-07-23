import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DrawerMenu from '../components/DrawerMenu';
import {
  UserIcon,
  LockClosedIcon,
  TrashIcon,
  InformationCircleIcon,
  BriefcaseIcon,
  CameraIcon,
  UsersIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
// import { MailIcon, LogoutIcon } from '@heroicons/react/24/solid';

const menuItemsAccount = [
  { label: 'Edit profile', icon: UserIcon, onClick: () => {} },
  { label: 'Change Email', icon: LockClosedIcon, onClick: () => {} },
  { label: 'Change Password', icon: LockClosedIcon, onClick: () => {} },
  { label: 'Email Visa Connect', icon: EnvelopeIcon, onClick: () => {} },
  { label: 'Logout', icon: LockClosedIcon, onClick: () => {} },
  { label: 'Delete account', icon: TrashIcon, onClick: () => {}, danger: true },
];

const menuItemsPreferences = [
  {
    label: 'Preferences (Wizard)',
    icon: InformationCircleIcon,
    onClick: () => {},
  },
  { label: 'Jobs applied to', icon: BriefcaseIcon, onClick: () => {} },
  {
    label: 'Jobs posted (only for approved employers)',
    icon: CameraIcon,
    onClick: () => {},
  },
  { label: 'Meetups posted', icon: UsersIcon, onClick: () => {} },
  {
    label: 'Meetups I’m interested in',
    icon: ArrowRightIcon,
    onClick: () => {},
  },
];

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuClick = () => setMenuOpen(true);
  const handleOverlayClick = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-8 relative">
      <DrawerMenu
        open={menuOpen}
        onClose={handleOverlayClick}
        navigate={navigate}
        highlight="settings"
      />
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-gray-50 sticky top-0 z-20">
        <button
          className="mr-2"
          onClick={handleMenuClick}
          aria-label="Open menu"
        >
          {/* Hamburger icon */}
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="text-2xl font-bold text-sky-700 mr-2">V</span>
        <h1 className="flex-1 text-xl font-semibold text-center -ml-8">
          Settings
        </h1>
      </div>

      {/* Account Section */}
      <div className="px-4 mt-4">
        <h2 className="text-gray-700 text-base font-semibold mb-2">Account</h2>
        <div className="bg-white rounded-2xl shadow p-2 divide-y divide-gray-100">
          {menuItemsAccount.map((item, idx) => (
            <button
              key={item.label}
              className={`flex items-center w-full px-2 py-3 text-left gap-3 ${
                item.danger ? 'text-red-600' : 'text-gray-800'
              } hover:bg-gray-50 focus:outline-none`}
              onClick={item.onClick}
            >
              <item.icon
                className={`h-5 w-5 ${
                  item.danger ? 'text-red-500' : 'text-gray-400'
                }`}
              />
              <span className="flex-1 text-base">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preferences Section */}
      <div className="px-4 mt-8">
        <h2 className="text-gray-700 text-base font-semibold mb-2">
          Preferences
        </h2>
        <div className="bg-white rounded-2xl shadow p-2 divide-y divide-gray-100">
          {menuItemsPreferences.map((item, idx) => (
            <button
              key={item.label}
              className="flex items-center w-full px-2 py-3 text-left gap-3 text-gray-800 hover:bg-gray-50 focus:outline-none"
              onClick={item.onClick}
            >
              <item.icon className="h-5 w-5 text-gray-400" />
              <span className="flex-1 text-base">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
