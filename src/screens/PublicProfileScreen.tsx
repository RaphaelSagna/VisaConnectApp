import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

const PublicProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleMenuClick = () => {
    // Handle menu click - could open a drawer or navigate back
    navigate('/edit-profile');
  };

  const handleChatClick = () => {
    // Handle chat button click
    console.log('Chat clicked');
  };

  // Helper function to format travel experience
  const formatTravelExperience = () => {
    const experiences = [];
    if (user?.favorite_place) experiences.push(user.favorite_place);
    if (user?.favorite_state) experiences.push(user.favorite_state);
    if (user?.road_trips) experiences.push('road trips');

    if (experiences.length === 0) return 'Various destinations';
    if (experiences.length === 1) return experiences[0];
    if (experiences.length === 2) return experiences.join(' and ');
    return `${experiences.slice(0, -1).join(', ')}, and ${
      experiences[experiences.length - 1]
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Custom Header - matches the design */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Menu button and Logo */}
            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={handleMenuClick}
                aria-label="Menu"
              >
                <svg
                  className="h-6 w-6"
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
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
              </div>
            </div>

            {/* Center - User Name */}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold text-gray-900">
                {user?.first_name} {user?.last_name}
              </h1>
            </div>

            {/* Right side - Chat button */}
            <div className="flex items-center">
              <button
                onClick={handleChatClick}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                aria-label="Chat"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        {/* Profile Information Card */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-start space-x-4">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {user?.profile_photo_url ? (
                <img
                  src={user.profile_photo_url}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* User Attributes/Badges */}
            <div className="flex-1 space-y-2">
              {/* Has helped people - using mentorship_interest */}
              {user?.mentorship_interest && (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">
                    Interested in mentoring others
                  </span>
                </div>
              )}

              {/* Country of origin */}
              {user?.nationality && (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">
                    From {user.nationality}
                  </span>
                </div>
              )}

              {/* Travel experience */}
              {(user?.favorite_place ||
                user?.favorite_state ||
                user?.road_trips) && (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">
                    Enjoys {formatTravelExperience()}
                  </span>
                </div>
              )}

              {/* Visa type */}
              {user?.visa_type && (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">
                    Has a {user.visa_type} Visa
                  </span>
                </div>
              )}

              {/* Current location */}
              {user?.current_location?.city &&
                user?.current_location?.state && (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">
                      Lives in {user.current_location.city},{' '}
                      {user.current_location.state}
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Bio/Quote */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-900 text-sm leading-relaxed">{user?.bio}</p>
          </div>
        </div>

        {/* Things you have in common Card */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-3">
            Things you have in common with {user?.first_name}
          </h2>

          <div className="flex flex-wrap gap-2">
            {/* Languages */}
            {user?.languages && user.languages.length > 0 && (
              <button className="bg-black text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Languages ({user.languages.length})
              </button>
            )}

            {/* Hobbies */}
            {user?.hobbies && user.hobbies.length > 0 && (
              <button className="bg-black text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Hobbies ({user.hobbies.length})
              </button>
            )}

            {/* Favorite state */}
            {user?.favorite_state && (
              <button className="bg-black text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                {user.favorite_state}
              </button>
            )}

            {/* Visa type */}
            {user?.visa_type && (
              <button className="bg-black text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                {user.visa_type} Visa
              </button>
            )}

            {/* Preferred outings */}
            {user?.preferred_outings && user.preferred_outings.length > 0 && (
              <button className="bg-black text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Activities ({user.preferred_outings.length})
              </button>
            )}

            {/* Has car */}
            {user?.has_car !== undefined && (
              <button className="bg-black text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                {user.has_car ? 'Has Car' : 'No Car'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileScreen;
