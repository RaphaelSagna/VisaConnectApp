import React, { useState } from 'react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';

const TravelExplorationScreen: React.FC = () => {
  const [form, setForm] = useState({
    roadTrips: 'yes' as 'yes' | 'no',
    favoritePlace: '',
    travelTips: '',
    willingToGuide: 'no' as 'yes' | 'no',
  });
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 flex flex-col items-center pb-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Header */}
        <div className="w-full bg-blue-100 rounded-b-3xl flex flex-col items-center py-6 mb-6 relative">
          <h1 className="text-xl font-bold text-gray-900 mb-2 text-center px-4">
            Tell us about your travel and exploration in the U.S.
          </h1>
          <MapPinIcon className="h-12 w-12 text-sky-500 mb-2" />
          {/* Progress dots */}
          <div className="flex gap-1 mb-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            <span className="w-2 h-2 bg-gray-800 rounded-full inline-block" />{' '}
            {/* Current step */}
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
          </div>
        </div>
        {/* Form Fields */}
        <div className="w-full flex flex-col px-4">
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              Have you taken any road trips in the U.S.?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-6 py-3 rounded-full font-semibold text-white ${
                  form.roadTrips === 'yes' ? 'bg-sky-400' : 'bg-sky-200'
                } focus:outline-none`}
                onClick={() => setForm({ ...form, roadTrips: 'yes' })}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-6 py-3 rounded-full font-semibold border-2 ${
                  form.roadTrips === 'no'
                    ? 'border-sky-400 text-sky-400'
                    : 'border-gray-300 text-gray-800'
                } bg-white focus:outline-none`}
                onClick={() => setForm({ ...form, roadTrips: 'no' })}
              >
                No
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              What’s your favorite city or place you’ve visited here?
            </label>
            <input
              name="favoritePlace"
              placeholder="Enter your favorite place"
              value={form.favoritePlace}
              onChange={(e) =>
                setForm({ ...form, favoritePlace: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-sky-300 mb-4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              Do you have tips for others traveling in the U.S.?
            </label>
            <textarea
              name="travelTips"
              placeholder="Share your travel tips"
              value={form.travelTips}
              onChange={(e) => setForm({ ...form, travelTips: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-sky-300 mb-4 min-h-[80px]"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-800 font-medium mb-2">
              Are you open to being a travel guide for a city you know well?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-6 py-3 rounded-full font-semibold text-white ${
                  form.willingToGuide === 'yes' ? 'bg-sky-400' : 'bg-sky-200'
                } focus:outline-none`}
                onClick={() => setForm({ ...form, willingToGuide: 'yes' })}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-6 py-3 rounded-full font-semibold border-2 ${
                  form.willingToGuide === 'no'
                    ? 'border-sky-400 text-sky-400'
                    : 'border-gray-300 text-gray-800'
                } bg-white focus:outline-none`}
                onClick={() => setForm({ ...form, willingToGuide: 'no' })}
              >
                No
              </button>
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          className="w-full max-w-md mb-2 mx-4"
          onClick={() => navigate('/knowledge-community')}
        >
          Continue
        </Button>
        <button
          className="text-gray-500 underline text-base mt-2"
          onClick={() => navigate('/dashboard')}
        >
          Skip and finish later
        </button>
      </div>
    </div>
  );
};

export default TravelExplorationScreen;
