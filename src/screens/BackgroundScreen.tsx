import React, { useState } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

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

const BackgroundScreen: React.FC = () => {
  const [form, setForm] = useState({
    nationality: '',
    languages: '',
    workHistory: '',
    relationshipStatus: '',
    stayInUS: 'yes' as 'yes' | 'no',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStayInUSChange = (value: 'yes' | 'no') => {
    setForm({ ...form, stayInUS: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 pt-8 pb-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Header */}
        <div className="w-full bg-yellow-100 rounded-b-3xl flex flex-col items-center py-6 mb-6 relative">
          {/* Progress dots */}
          <div className="absolute top-2 right-4 flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            <span className="w-2 h-2 bg-gray-800 rounded-full inline-block" />
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2 text-center px-4">
            Let's learn about you so we can get you connected
          </h1>
          {/* Handshake icon placeholder */}
          <div className="text-4xl mb-2">🤝</div>
        </div>

        {/* Form Fields */}
        <div className="w-full flex flex-col">
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              What is your nationality?
            </label>
            <Input
              name="nationality"
              placeholder="Enter your nationality"
              value={form.nationality}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              What languages do you speak?
            </label>
            <Input
              name="languages"
              placeholder="Enter languages you speak"
              value={form.languages}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              Where else have you worked in the USA?
            </label>
            <Input
              name="workHistory"
              placeholder="Enter your work history"
              value={form.workHistory}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">
              What is your relationship status? (single, married)
            </label>
            <Input
              name="relationshipStatus"
              placeholder="Enter your relationship status"
              value={form.relationshipStatus}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-800 font-medium mb-2">
              Do you plan to stay in the U.S. long-term or return to your
              country?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-6 py-3 rounded-full font-semibold text-white ${
                  form.stayInUS === 'yes' ? 'bg-sky-400' : 'bg-sky-200'
                } focus:outline-none`}
                onClick={() => handleStayInUSChange('yes')}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-6 py-3 rounded-full font-semibold border-2 ${
                  form.stayInUS === 'no'
                    ? 'border-sky-400 text-sky-400'
                    : 'border-gray-300 text-gray-800'
                } bg-white focus:outline-none`}
                onClick={() => handleStayInUSChange('no')}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <Button
          variant="primary"
          className="w-full max-w-md mb-2"
          onClick={() => navigate('/lifestyle')}
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

export default BackgroundScreen;
