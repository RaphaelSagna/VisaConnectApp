import React, { useState } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import DrawerMenu from '../components/DrawerMenu';

const DashboardScreen: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = () => setMenuOpen(true);
  const handleOverlayClick = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <DrawerMenu
        open={menuOpen}
        onClose={handleOverlayClick}
        navigate={navigate}
        highlight={undefined}
      />
      {/* Navigation Bar */}
      <div className="bg-white px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          <button className="text-2xl" onClick={handleMenuClick}>
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">V</span>
            <span className="font-bold text-lg">Your Dashboard</span>
          </div>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        {/* Notifications Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Notifications (3 new)</h2>
            <span className="text-gray-500">→</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-500">✓</span>
              <span className="font-semibold">Personalized experience</span>
            </div>
            <p className="text-gray-600 mb-4">3 out of 6 completed</p>
            <Button variant="primary" className="w-full">
              Complete questionnaire
            </Button>
          </div>
        </div>

        {/* Connect, Grow & Thrive Section */}
        <div className="mb-6">
          <h2 className="font-bold text-xl mb-2">Connect, Grow & Thrive</h2>
          <p className="text-gray-600">
            Access tools to build your career, make new friends, and navigate
            life in the U.S. with support from your community.
          </p>
        </div>

        {/* Work Portal Card */}
        <div className="bg-amber-50 rounded-xl p-4 mb-4 shadow relative">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg">Work Portal</h3>
            <Button variant="primary" size="sm">
              Explore
            </Button>
          </div>
          <ul className="text-gray-700 mb-4 space-y-1">
            <li>• Job discovery</li>
            <li>• Company reviews</li>
            <li>• User tips</li>
            <li>• Professional grow</li>
          </ul>
          {/* Illustration */}
          {/* <div className="absolute top-4 right-4 text-4xl">🌙☁️💤⭐</div> */}
        </div>

        {/* Social Portal Card */}
        <div className="bg-green-50 rounded-xl p-4 shadow relative">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg">Social Portal</h3>
            <Button variant="primary" size="sm">
              Explore
            </Button>
          </div>
          <ul className="text-gray-700 mb-4 space-y-1">
            <li>• Cultural exchange</li>
            <li>• Event planning</li>
            <li>• Weekend meetups</li>
            <li>• Trips, tips and advice</li>
          </ul>
          {/* Illustration */}
          {/* <div className="absolute top-4 right-4 text-4xl">🌙☁️💤⭐</div> */}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t px-4 py-2">
        <div className="flex items-center justify-around">
          <button className="text-2xl">←</button>
          <button className="text-2xl">→</button>
          <button className="text-2xl">+</button>
          <button className="text-2xl relative">
            □
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
