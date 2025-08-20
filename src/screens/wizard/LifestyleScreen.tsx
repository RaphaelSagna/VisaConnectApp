import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { apiPatch } from '../../api';
import { useUserStore } from '../../stores/userStore';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-sky-300 mb-4 ${className}`}
    {...props}
  />
));
Input.displayName = 'Input';

const LifestyleScreen: React.FC = () => {
  const [form, setForm] = useState({
    hobbies: '',
    favoriteState: '',
    outings: '',
    hasCar: 'yes' as 'yes' | 'no',
    willingToDrive: 'no' as 'yes' | 'no',
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Zustand store
  const { user, updateUser } = useUserStore();

  // Pre-populate form with existing user data
  useEffect(() => {
    if (user) {
      setForm({
        hobbies: user.hobbies?.join(', ') || '',
        favoriteState: user.favorite_state || '',
        outings: user.preferred_outings?.join(', ') || '',
        hasCar: user.has_car ? 'yes' : 'no',
        willingToDrive: user.offers_rides ? 'yes' : 'no',
      });
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user?.uid) {
      navigate('/sign-in');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggle = (
    field: 'hasCar' | 'willingToDrive',
    value: 'yes' | 'no'
  ) => {
    setForm({ ...form, [field]: value });
  };

  const handleContinue = async () => {
    setLoading(true);
    setApiError('');
    try {
      if (!user?.uid) throw new Error('User not authenticated');

      // Update user profile with lifestyle information
      const updateData = {
        hobbies: form.hobbies ? [form.hobbies] : [],
        favorite_state: form.favoriteState,
        preferred_outings: form.outings ? [form.outings] : [],
        has_car: form.hasCar === 'yes',
        offers_rides: form.willingToDrive === 'yes',
        profile_answers: {
          lifestyle_personality: {
            hobbies: form.hobbies ? [form.hobbies] : [],
            favoriteState: form.favoriteState,
            outings: form.outings ? [form.outings] : [],
            hasCar: form.hasCar,
            willingToDrive: form.willingToDrive,
          },
        },
      };

      await apiPatch('/api/user/profile', updateData);

      // Update local store with new data
      updateUser(updateData);

      setLoading(false);
      navigate('/travel-exploration');
    } catch (err: any) {
      setApiError(err.message || 'Failed to save lifestyle info');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-4">
      {/* Loading state for form submission */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
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

      {/* Loading state for user data */}
      {!user && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      )}

      {user && (
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Header */}
          <div className="w-full bg-green-100 rounded-b-3xl flex flex-col items-center py-6 mb-6 relative">
            <h1 className="text-xl font-bold text-gray-900 mb-2 text-center px-4">
              Tell us about your lifestyle and personality
            </h1>
            <HandThumbUpIcon className="h-12 w-12 text-sky-500 mb-2" />
            {/* Progress dots */}
            <div className="flex gap-1 mb-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
              <span className="w-2 h-2 bg-gray-800 rounded-full inline-block" />
              {/* Current step */}
              <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
              <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
              <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            </div>
          </div>
          {/* Form Fields */}
          <div className="w-full flex flex-col px-4">
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                What are your hobbies and interests?
              </label>
              <Input
                name="hobbies"
                placeholder="Enter your hobbies"
                value={form.hobbies}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                What's your favorite state in the U.S.?
              </label>
              <Input
                name="favoriteState"
                placeholder="Enter your favorite state"
                value={form.favoriteState}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                What kind of outings do you enjoy most? (Beach, party, museum,
                hike)
              </label>
              <Input
                name="outings"
                placeholder="Enter your preferred outings"
                value={form.outings}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Do you have a car?
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-6 py-3 rounded-full font-semibold text-white ${
                    form.hasCar === 'yes' ? 'bg-sky-400' : 'bg-sky-200'
                  } focus:outline-none`}
                  onClick={() => handleToggle('hasCar', 'yes')}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 rounded-full font-semibold border-2 ${
                    form.hasCar === 'no'
                      ? 'border-sky-400 text-sky-400'
                      : 'border-gray-300 text-gray-800'
                  } bg-white focus:outline-none`}
                  onClick={() => handleToggle('hasCar', 'no')}
                >
                  No
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-800 font-medium mb-2">
                Are you willing to drive or help others with rides?
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-6 py-3 rounded-full font-semibold border-2 ${
                    form.willingToDrive === 'yes'
                      ? 'border-sky-400 text-sky-400'
                      : 'border-gray-300 text-gray-800'
                  } bg-white focus:outline-none`}
                  onClick={() => handleToggle('willingToDrive', 'yes')}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 rounded-full font-semibold border-2 ${
                    form.willingToDrive === 'no'
                      ? 'border-sky-400 text-sky-400'
                      : 'border-gray-300 text-gray-800'
                  } bg-white focus:outline-none`}
                  onClick={() => handleToggle('willingToDrive', 'no')}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Continue button */}
          <Button
            variant="primary"
            className="w-full max-w-md mb-2 px-4"
            onClick={handleContinue}
            disabled={loading}
          >
            Save & Continue
          </Button>
          {apiError && (
            <div className="text-red-500 text-center mt-2">{apiError}</div>
          )}
          <button
            className="text-gray-500 underline text-base mt-2"
            onClick={() => navigate('/dashboard')}
          >
            Skip and finish later
          </button>
        </div>
      )}
    </div>
  );
};

export default LifestyleScreen;
