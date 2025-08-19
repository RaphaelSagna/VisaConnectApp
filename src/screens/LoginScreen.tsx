import React, { useState } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { apiPostPublic } from '../api';
import logo from '../assets/images/logo.png';

// Types for login response
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    visa_type?: string;
    current_location?: {
      city: string;
      state: string;
      country: string;
    };
    occupation?: string;
    employer?: string;
    nationality?: string;
    languages?: string[];
    other_us_jobs?: string[];
    relationship_status?: string;
    hobbies?: string[];
    favorite_state?: string;
    preferred_outings?: string[];
    has_car?: boolean;
    offers_rides?: boolean;
    road_trips?: boolean;
    favorite_place?: string;
    travel_tips?: string;
    willing_to_guide?: boolean;
    mentorship_interest?: boolean;
    job_boards?: string[];
    visa_advice?: string;
    profile_answers?: Record<string, any>;
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
      // Login with backend API
      const loginResponse = await apiPostPublic<LoginResponse>(
        '/api/auth/login',
        {
          email: form.email,
          password: form.password,
        }
      );

      console.log('Login response:', loginResponse); // Debug log

      if (loginResponse.data) {
        // Store user data from backend response
        localStorage.setItem(
          'userData',
          JSON.stringify({
            uid: loginResponse.data.id,
            email: loginResponse.data.email,
            first_name: loginResponse.data.first_name || '',
            last_name: loginResponse.data.last_name || '',
            visa_type: loginResponse.data.visa_type || '',
            current_location: loginResponse.data.current_location || {},
            occupation: loginResponse.data.occupation || '',
            employer: loginResponse.data.employer || '',
            // Include all profile fields for completion calculation
            nationality: loginResponse.data.nationality,
            languages: loginResponse.data.languages || [],
            other_us_jobs: loginResponse.data.other_us_jobs || [],
            relationship_status: loginResponse.data.relationship_status,
            hobbies: loginResponse.data.hobbies || [],
            favorite_state: loginResponse.data.favorite_state,
            preferred_outings: loginResponse.data.preferred_outings || [],
            has_car: loginResponse.data.has_car,
            offers_rides: loginResponse.data.offers_rides,
            road_trips: loginResponse.data.road_trips,
            favorite_place: loginResponse.data.favorite_place,
            travel_tips: loginResponse.data.travel_tips,
            willing_to_guide: loginResponse.data.willing_to_guide,
            mentorship_interest: loginResponse.data.mentorship_interest,
            job_boards: loginResponse.data.job_boards || [],
            visa_advice: loginResponse.data.visa_advice,
            profile_answers: loginResponse.data.profile_answers || {},
          })
        );

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      // Handle backend API errors
      let userFriendlyError = 'Sign in failed';

      if (error.message) {
        if (error.message.includes('Invalid email or password')) {
          userFriendlyError = 'Username and/or password is invalid';
        } else if (error.message.includes('Authentication failed')) {
          userFriendlyError = 'Authentication failed. Please try again.';
        } else if (error.message.includes('Invalid response from server')) {
          userFriendlyError = 'Server error. Please try again.';
        } else {
          userFriendlyError =
            error.message || 'Sign in failed. Please try again.';
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
