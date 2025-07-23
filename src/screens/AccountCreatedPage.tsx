import React from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const AccountCreatedPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 pt-8 pb-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Icon and Title */}
        <div className="flex flex-col items-center mb-4">
          {/* Placeholder for target icon */}
          <div className="w-16 h-16 mb-2 flex items-center justify-center">
            <span role="img" aria-label="target" className="text-5xl">
              🎯
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-center leading-tight">
            Congrats! Your
            <br />
            account is created
          </h1>
        </div>
        {/* Subtitle */}
        <p className="text-gray-700 text-center text-base mb-6">
          Filling out the following screens will help you:
        </p>
        {/* Benefits List */}
        <div className="w-full flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-4 bg-red-100 rounded-2xl shadow p-4">
            {/* Placeholder for personalize icon */}
            <span className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-2xl">
              🖊️
            </span>
            <span className="font-semibold text-gray-800">
              Personalize your experience
            </span>
          </div>
          <div className="flex items-center gap-4 bg-yellow-100 rounded-2xl shadow p-4">
            {/* Placeholder for match icon */}
            <span className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-2xl">
              👥
            </span>
            <span className="font-semibold text-gray-800">
              Match you with others who share
              <br />
              similar background and interests
            </span>
          </div>
          <div className="flex items-center gap-4 bg-green-100 rounded-2xl shadow p-4">
            {/* Placeholder for lock icon */}
            <span className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-2xl">
              🔒
            </span>
            <span className="font-semibold text-gray-800">
              Allow you to post and apply for jobs, have meetups and connect
              with the community
            </span>
          </div>
        </div>
        {/* Let's go button */}
        <Button
          variant="primary"
          className="w-full max-w-md"
          onClick={() => navigate('/background')}
        >
          Let's go!
        </Button>
      </div>
    </div>
  );
};

export default AccountCreatedPage;
