import React from 'react';
import Button from '../components/Button';
import illustration from '../assets/images/welcome_image.png'; // Replace with your actual illustration image
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo and Title */}
      <div className="mb-2 flex flex-col items-center">
        <img src={logo} alt="Logo" className="" />
      </div>
      {/* Description */}
      <p className="text-gray-600 text-center text-sm md:text-base mb-4 max-w-xl">
        Access tools to build your career, make new friends, and navigate life
        in the U.S. with support from your community.
      </p>
      {/* Illustration */}
      <div className="w-full max-w-xs md:max-w-md mb-6">
        <img
          src={illustration}
          alt="Community Illustration"
          className="rounded-2xl w-full h-auto"
        />
      </div>
      {/* Buttons */}
      <div className="w-full max-w-xs md:max-w-md flex flex-col gap-4 mt-auto">
        <Button variant="primary" onClick={() => navigate('/create-account')}>
          Get Started
        </Button>
        <Button variant="secondary" onClick={() => navigate('/sign-in')}>
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
