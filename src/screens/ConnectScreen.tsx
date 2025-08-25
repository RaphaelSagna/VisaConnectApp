import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import Button from '../components/Button';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  visa_type: string;
  current_location: string;
  occupation: string;
  profile_photo_url?: string;
  bio?: string;
}

const ConnectScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleMenuClick = () => {
    navigate('/social');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // TODO: Implement actual search API call
    // For now, simulate search results
    setTimeout(() => {
      const mockResults: User[] = [
        {
          id: '1',
          first_name: 'Sarah',
          last_name: 'Chen',
          visa_type: 'H-1B',
          current_location: 'San Francisco, CA',
          occupation: 'Software Engineer',
          bio: 'Love exploring new restaurants and hiking trails!',
        },
        {
          id: '2',
          first_name: 'Miguel',
          last_name: 'Rodriguez',
          visa_type: 'L-1',
          current_location: 'Austin, TX',
          occupation: 'Product Manager',
          bio: 'Passionate about technology and community building.',
        },
        {
          id: '3',
          first_name: 'Priya',
          last_name: 'Patel',
          visa_type: 'H-1B',
          current_location: 'Seattle, WA',
          occupation: 'Data Scientist',
          bio: 'Interested in AI/ML and outdoor adventures.',
        },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleUserClick = (userId: string) => {
    // TODO: Navigate to user profile or start chat
    console.log('Navigate to user:', userId);
  };

  const handleConnect = (userId: string) => {
    // TODO: Implement connection request
    console.log('Send connection request to:', userId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <NavigationBar currentPage="social" onMenuClick={handleMenuClick} />

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Connect</h1>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, location, occupation, or visa type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results
            </h2>
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="p-6">
                  {/* User Avatar and Basic Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      {user.profile_photo_url ? (
                        <img
                          src={user.profile_photo_url}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-bold text-blue-600 mb-2 cursor-pointer hover:text-blue-700 transition-colors"
                        onClick={() => handleUserClick(user.id)}
                      >
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-gray-600 text-sm font-medium">
                        {user.occupation}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleConnect(user.id)}
                      className="px-4 py-2"
                    >
                      Connect
                    </Button>
                  </div>

                  {/* User Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="font-medium mr-2">Location:</span>
                      <span>{user.current_location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="font-medium mr-2">Visa:</span>
                      <span>{user.visa_type}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <div className="text-sm text-gray-700">
                      <span className="font-medium mr-2">About:</span>
                      <span>{user.bio}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {searchQuery && !isSearching && searchResults.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse our community
            </p>
          </div>
        )}

        {/* Initial State */}
        {!searchQuery && searchResults.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start searching
            </h3>
            <p className="text-gray-600">
              Search for users by name, location, occupation, or visa type
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectScreen;
