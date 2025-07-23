import React, { useState } from 'react';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const KnowledgeCommunityScreen: React.FC = () => {
  const [form, setForm] = useState({
    mentorshipInterest: 'no' as 'yes' | 'no',
    jobBoards: '',
    visaAdvice: '',
  });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Header */}
        <div className="w-full bg-purple-100 rounded-b-3xl flex flex-col items-center py-6 mb-6 relative">
          <AcademicCapIcon className="h-12 w-12 text-sky-500 mb-2" />
          {/* Progress dots */}
          <div className="flex gap-1 mb-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            <span className="w-2 h-2 bg-gray-800 rounded-full inline-block" />{' '}
            {/* Current step */}
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2 text-center px-4">
            Knowledge & Community
          </h1>
        </div>
        {/* Form Fields */}
        <div className="w-full flex flex-col px-4">
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              Would you be open to mentoring someone with your visa type?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-6 py-3 rounded-full font-semibold text-white ${
                  form.mentorshipInterest === 'yes'
                    ? 'bg-sky-400'
                    : 'bg-sky-200'
                } focus:outline-none`}
                onClick={() => setForm({ ...form, mentorshipInterest: 'yes' })}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-6 py-3 rounded-full font-semibold border-2 ${
                  form.mentorshipInterest === 'no'
                    ? 'border-sky-400 text-sky-400'
                    : 'border-gray-300 text-gray-800'
                } bg-white focus:outline-none`}
                onClick={() => setForm({ ...form, mentorshipInterest: 'no' })}
              >
                No
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              Do you know any good online job boards or agencies?
            </label>
            <input
              name="jobBoards"
              placeholder="List job boards or agencies"
              value={form.jobBoards}
              onChange={(e) => setForm({ ...form, jobBoards: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-sky-300 mb-4"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-800 font-medium mb-2">
              What advice would you give someone starting their visa journey?
            </label>
            <textarea
              name="visaAdvice"
              placeholder="Share your advice"
              value={form.visaAdvice}
              onChange={(e) => setForm({ ...form, visaAdvice: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-sky-300 mb-4 min-h-[80px]"
            />
          </div>
        </div>
        <Button
          variant="primary"
          className="w-full max-w-md mb-2 mx-4"
          onClick={() => navigate('/dashboard')}
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

export default KnowledgeCommunityScreen;
