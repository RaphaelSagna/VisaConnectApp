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
        <div className="flex-1 px-4 py-6">
          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {profile.firstName || 'there'}! 👋
            </h1>
            <p className="text-gray-600">
              Ready to connect, grow, and thrive in your U.S. journey?
            </p>
          </div>

          {/* ... rest of the dashboard ... */}
          {/* Notifications Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">Notifications (0 new)</h2>
              <span className="text-gray-500">→</span>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-500">✓</span>
                <span className="font-semibold">Personalized experience</span>
              </div>
              <p className="text-gray-600 mb-4">0 out of 4 completed</p>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/background')}
              >
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
      )}
    </div>
  );
};

export default DashboardScreen;
