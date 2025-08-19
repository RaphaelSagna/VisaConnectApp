import React, { useState } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { apiPostPublic } from '../api';
import logo from '../assets/images/logo.png';

// Types for API responses
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      first_name?: string;
      last_name?: string;
    };
    token: string;
  };
}

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

const SignInScreen: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    if (!form.password) newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setApiError('');

    try {
      // Login with the new API endpoint
      const response = await apiPostPublic<LoginResponse>('/api/auth/login', {
        email: form.email,
        password: form.password,
      });

      // Store the token and user data
      if (response.data && response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem(
          'userData',
          JSON.stringify({
            uid: response.data.user.id,
            email: response.data.user.email,
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
          })
        );

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      // Handle API errors
      let userFriendlyError = 'Sign in failed';

      if (error.message) {
        if (error.message.includes('Invalid email or password')) {
          userFriendlyError = 'Username and/or password is invalid';
        } else if (error.message.includes('too many')) {
          userFriendlyError =
            'Too many failed attempts. Please try again later.';
        } else {
          userFriendlyError = error.message;
        }
      }

      setApiError(userFriendlyError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 pt-8 pb-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <img src={logo} alt="VisaConnect Logo" className="h-16 w-auto" />
          </div>
          <p className="text-gray-600 text-center">Sign in to your account</p>
        </div>

        {/* Form */}
        <form className="w-full" onSubmit={handleSubmit}>
          {apiError && (
            <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-600 text-sm">{apiError}</p>
            </div>
          )}

          <div className="mb-4">
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div className="mb-6">
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mb-4"
            disabled={submitting}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Forgot Password */}
        <button className="text-sky-500 underline text-base mb-6">
          Forgot Password?
        </button>

        {/* Back to Welcome */}
        <button
          className="text-gray-500 underline text-base"
          onClick={() => navigate('/')}
        >
          ← Back to Welcome
        </button>
      </div>
    </div>
  );
};

export default SignInScreen;
