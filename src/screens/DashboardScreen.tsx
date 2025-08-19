import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import DrawerMenu from '../components/DrawerMenu';

const DashboardScreen: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;

    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    // Use localStorage data instead of API call
    setProfile({
      firstName: user.first_name || 'User',
      lastName: user.last_name || '',
      email: user.email || '',
      location: user.location || '',
      visaType: user.visa_type || '',
      employer: user.employer || '',
      job: user.job || '',
      // Mock profile answers for now
      profileAnswers: {
        background_identity: {
          nationality: '',
          languages: [],
          firstTimeInUS: { year: null, location: '', visa: '' },
          jobDiscoveryMethod: '',
          visaChangeJourney: '',
          otherUSJobs: [],
        },
        lifestyle_personality: {
          hobbies: [],
          favoriteState: '',
          preferredOutings: [],
          hasCar: false,
          offersRides: false,
          relationshipStatus: '',
        },
        travel_exploration: {
          roadTrips: false,
          favoritePlace: '',
          travelTips: '',
          willingToGuide: false,
        },
        knowledge_community: {
          mentorshipInterest: false,
          jobBoards: [],
          visaAdvice: '',
        },
      },
    });
    setLoading(false);
  }, []);

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
      <div className="bg-white px-4 md:px-6 py-2 md:py-4 border-b shadow-sm">
        <div className="flex items-center justify-between">
          <button className="text-2xl text-gray-600" onClick={handleMenuClick}>
            ☰
          </button>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl font-bold text-blue-600">
              V
            </span>
            <span className="font-bold text-lg md:text-xl text-gray-800">
              VisaConnect
            </span>
          </div>
          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-600">Dashboard</span>
            <span className="text-gray-500">Work</span>
            <span className="text-gray-500">Social</span>
            <span className="text-gray-500">Chat</span>
            <span className="text-gray-500">Settings</span>
            <span className="text-gray-500">Contact</span>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">👤</span>
            </div>
          </div>
          {/* Mobile Spacer */}
          <div className="w-6 md:hidden"></div>
        </div>
      </div>
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <svg
            className="animate-spin h-10 w-10 text-sky-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
      {error && !loading && (
        <div className="flex-1 flex items-center justify-center text-red-500 font-semibold">
          {error}
        </div>
      )}
      {!loading && !error && profile && (
        <div className="flex-1 px-4 md:px-6 py-4 md:py-8 max-w-4xl mx-auto">
          {/* Your Dashboard Title */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
              Your Dashboard
            </h1>
          </div>

          {/* Notifications Section - Mobile First */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg md:text-xl text-gray-900">
                Notifications (3 new)
              </h2>
              <span className="text-gray-500 text-xl">→</span>
            </div>
          </div>

          {/* Personalized Experience Card */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-6 md:mb-8">
            <h2 className="font-bold text-lg md:text-xl text-gray-900 mb-3">
              Personalized experience
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-500 text-base md:text-lg">✓</span>
              <span className="text-gray-700 text-sm md:text-base">
                3 out of 6 completed
              </span>
            </div>
            <div className="text-center">
              <Button
                variant="primary"
                className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 text-base md:text-lg"
                onClick={() => navigate('/background')}
              >
                Complete questionnaire
              </Button>
            </div>
          </div>

          {/* Connect, Grow & Thrive Section */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">
              Connect, Grow & Thrive
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4 md:px-0">
              Access tools to build your career, make new friends, and navigate
              life in the U.S. with support from your community.
            </p>
          </div>

          {/* Work Portal Card */}
          <div className="bg-amber-50 rounded-xl p-4 md:p-6 shadow-sm mb-4 md:mb-6 relative">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start md:gap-0">
              <div className="flex-1">
                <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3 md:mb-4">
                  Work Portal
                </h3>
                <ul className="text-gray-700 space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>• Job discovery</li>
                  <li>• Company reviews</li>
                  <li>• User tips</li>
                  <li>• Professional grow</li>
                </ul>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full md:w-auto md:ml-6"
              >
                Explore
              </Button>
            </div>
            {/* Mobile Illustration Placeholder */}
            <div className="hidden md:block absolute top-4 right-4 text-2xl opacity-20">
              🌙☁️💤⭐
            </div>
          </div>

          {/* Social Portal Card */}
          <div className="bg-green-50 rounded-xl p-4 md:p-6 shadow-sm relative">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start md:gap-0">
              <div className="flex-1">
                <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3 md:mb-4">
                  Social Portal
                </h3>
                <ul className="text-gray-700 space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>• Cultural exchange</li>
                  <li>• Event planning</li>
                  <li>• Weekend meetups</li>
                  <li>• Trips, tips and advice</li>
                </ul>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full md:w-auto md:ml-6"
              >
                Explore
              </Button>
            </div>
            {/* Mobile Illustration Placeholder */}
            <div className="hidden md:block absolute top-4 right-4 text-2xl opacity-20">
              🌙☁️💤⭐
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
