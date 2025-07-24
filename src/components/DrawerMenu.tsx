import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
  highlight?: 'settings';
}

const menuItems = [
  { label: 'Dashboard', route: '/dashboard' },
  { label: 'Work', route: '/work' },
  { label: 'Social', route: '/social' },
  { label: 'Chat', route: '/chat' },
  { label: 'Settings', route: '/settings', highlight: true },
  { label: 'Contact us', route: '/contact' },
];

const DrawerMenu: React.FC<DrawerMenuProps> = ({
  open,
  onClose,
  navigate,
  highlight,
}) => {
  if (!open) return null;

  const handleMenuItemClick = (item: (typeof menuItems)[0]) => {
    onClose();
    if (item.route) {
      navigate(item.route);
    }
  };

  // Only Dashboard and Settings are enabled
  const enabledLabels = ['Dashboard', 'Settings'];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed top-0 left-0 w-72 bg-white shadow-2xl z-40 flex flex-col rounded-tr-2xl rounded-br-2xl overflow-hidden animate-slideIn max-w-xs">
        {/* Header with logo and close button */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-sky-700">V</span>
            <span className="font-semibold text-lg">Visa</span>
            <span className="font-light text-lg">Connect</span>
          </div>
          <button onClick={onClose} aria-label="Close menu">
            <XMarkIcon className="h-7 w-7 text-gray-500" />
          </button>
        </div>
        {/* Menu Items */}
        <nav className="flex flex-col px-2 pt-2 pb-4">
          {menuItems.slice(0, 5).map((item) => {
            const enabled = enabledLabels.includes(item.label);
            return (
              <button
                key={item.label}
                className={`w-full text-left px-6 py-3 rounded transition font-medium text-base ${
                  item.label === 'Settings' && highlight === 'settings'
                    ? 'bg-gray-100 font-bold text-gray-900'
                    : 'text-gray-800 hover:bg-gray-50'
                } ${item.label === 'Settings' ? 'mt-1' : ''} ${
                  !enabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={enabled ? () => handleMenuItemClick(item) : undefined}
                disabled={!enabled}
              >
                {item.label}
              </button>
            );
          })}
          {/* Divider */}
          <div className="border-t border-gray-200 my-2" />
          {/* Contact us */}
          <button
            className="w-full text-left px-6 py-3 rounded transition text-gray-800 hover:bg-gray-50 font-medium text-base opacity-50 cursor-not-allowed"
            disabled
          >
            Contact us
          </button>
        </nav>
      </div>
    </>
  );
};

export default DrawerMenu;
