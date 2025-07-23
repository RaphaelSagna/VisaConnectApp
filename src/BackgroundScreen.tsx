import React, { useState } from 'react';
import Button from './components/Button';

const BackgroundScreen: React.FC = () => {
  const [stayInUS, setStayInUS] = useState<'yes' | 'no' | null>(null);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Background &amp; Identity
          </h1>
          {/* Handshake icon placeholder */}
          <div className="text-4xl mb-2">🤝</div>
        </div>
        {/* Questions */}
        <div className="w-full flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow">
            <span className="text-gray-800">What is your nationality?</span>
            <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-xl text-sky-500">
              <span>→</span>
            </button>
          </div>
          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow">
            <span className="text-gray-800">What languages do you speak?</span>
            <button className="w-8 h-8 flex items-center justify-center bg-sky-400 rounded-full text-xl text-white">
              <span>→</span>
            </button>
          </div>
          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow">
            <span className="text-gray-800">
              Where else have you worked in the USA?
            </span>
            <button className="w-8 h-8 flex items-center justify-center bg-sky-400 rounded-full text-xl text-white">
              <span>→</span>
            </button>
          </div>
          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow">
            <span className="text-gray-800">
              What is your relationship status?
              <br />
              (single, married)
            </span>
            <button className="w-8 h-8 flex items-center justify-center bg-sky-400 rounded-full text-xl text-white">
              <span>→</span>
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-gray-800 mb-2">
              Do you plan to stay in the U.S. long-term or return to your
              country?
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-6 py-2 rounded-full font-semibold text-white ${
                  stayInUS === 'yes' ? 'bg-sky-400' : 'bg-sky-200'
                } focus:outline-none`}
                onClick={() => setStayInUS('yes')}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-6 py-2 rounded-full font-semibold border-2 ${
                  stayInUS === 'no'
                    ? 'border-sky-400 text-sky-400'
                    : 'border-gray-300 text-gray-800'
                } bg-white focus:outline-none`}
                onClick={() => setStayInUS('no')}
              >
                No
              </button>
            </div>
          </div>
        </div>
        {/* Continue button */}
        <Button variant="primary" className="w-full max-w-md mb-2">
          Continue
        </Button>
        <button className="text-gray-500 underline text-base mt-2">
          Skip and finish later
        </button>
      </div>
    </div>
  );
};

export default BackgroundScreen;
