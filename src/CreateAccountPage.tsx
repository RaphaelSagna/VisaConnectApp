import React from 'react';
import Button from './Button';

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

const CreateAccountPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 pt-8 pb-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-1 mt-2 text-center">
          Create Account
        </h1>
        <p className="text-gray-500 text-center text-base mb-6">
          General information
        </p>
        <form className="w-full flex flex-col">
          <Input placeholder="First name" />
          <Input placeholder="Last name" />
          <Input placeholder="Email address" type="email" />
          <Input placeholder="Password" type="password" />
          <Input placeholder="Confirm password" type="password" />
          <div className="mt-8">
            <Button type="submit" variant="primary">
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;
