import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { UserIcon, PencilIcon } from '@heroicons/react/24/outline';
import NavigationBar from '../components/NavigationBar';

const EditProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();

  // Form state
  const [bio, setBio] = useState(user?.profile_answers?.bio || '');
  const [businessName, setBusinessName] = useState(
    user?.profile_answers?.business?.name || ''
  );
  const [businessDescription, setBusinessDescription] = useState(
    user?.profile_answers?.business?.description || ''
  );
  const [businessAddress, setBusinessAddress] = useState(
    user?.profile_answers?.business?.address || ''
  );
  const [businessWebsite, setBusinessWebsite] = useState(
    user?.profile_answers?.business?.website || ''
  );
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);

  const handleSaveProfile = async () => {
    try {
      await updateUser({
        profile_answers: {
          ...user?.profile_answers,
          bio,
          business: businessName
            ? {
                name: businessName,
                description: businessDescription,
                address: businessAddress,
                website: businessWebsite,
              }
            : undefined,
        },
      });
      navigate('/settings');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAddBusiness = () => {
    setIsEditingBusiness(true);
    // Set default values for new business
    setBusinessName('New Business');
    setBusinessDescription('');
    setBusinessAddress('');
    setBusinessWebsite('');
  };

  const handleUpdateBusiness = () => {
    setIsEditingBusiness(true);
  };

  const handleSaveBusiness = () => {
    setIsEditingBusiness(false);
  };

  const handleCancelBusiness = () => {
    setIsEditingBusiness(false);
    // Reset to original values or clear if no existing business
    if (user?.profile_answers?.business?.name) {
      setBusinessName(user.profile_answers.business.name);
      setBusinessDescription(user.profile_answers.business.description || '');
      setBusinessAddress(user.profile_answers.business.address || '');
      setBusinessWebsite(user.profile_answers.business.website || '');
    } else {
      // Clear business data if no existing business
      setBusinessName('');
      setBusinessDescription('');
      setBusinessAddress('');
      setBusinessWebsite('');
    }
  };

  const handleWizardClick = () => {
    navigate('/background');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Shared Navigation Bar */}
      <NavigationBar currentPage="settings" onMenuClick={() => {}} />

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            {/* Profile Picture */}
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {user?.profile_answers?.profileImage ? (
                <img
                  src={user.profile_answers.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12 text-gray-600" />
              )}
            </div>

            {/* Edit Icon Overlay */}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <PencilIcon className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* User Name */}
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {user?.first_name} {user?.last_name}
          </h1>

          {/* Wizard Link */}
          <button
            onClick={handleWizardClick}
            className="text-blue-600 underline text-sm hover:text-blue-700"
          >
            Review and edit all preferences (wizard)
          </button>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-3">Bio</h2>
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Tell us about yourself..."
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {bio.length}/160
            </div>
          </div>
        </div>

        {/* Business Section - Conditionally render based on existing business */}
        {!user?.profile_answers?.business?.name ? (
          /* Show "Do you have a business?" prompt if no business exists */
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3">
              Do you have a business?
            </h2>
            <button
              onClick={handleAddBusiness}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Business
            </button>
          </div>
        ) : (
          /* Show existing business details if business exists */
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">{businessName}</h3>
              <span className="text-blue-600 text-sm font-medium">
                Verified
              </span>
            </div>

            {isEditingBusiness ? (
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  placeholder="Business Name"
                />
                <input
                  type="text"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  placeholder="Business Description"
                />
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  placeholder="Address"
                />
                <input
                  type="text"
                  value={businessWebsite}
                  onChange={(e) => setBusinessWebsite(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  placeholder="Website"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveBusiness}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelBusiness}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <p className="text-gray-700">{businessDescription}</p>
                <p className="text-gray-600 text-sm">{businessAddress}</p>
                <p className="text-blue-600 text-sm">{businessWebsite}</p>
              </div>
            )}

            {!isEditingBusiness && (
              <button
                onClick={handleUpdateBusiness}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Update Profile
              </button>
            )}
          </div>
        )}

        {/* Global Update Button */}
        <button
          onClick={handleSaveProfile}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default EditProfileScreen;
