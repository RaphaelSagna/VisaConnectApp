import React, { useState } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import CityAutocomplete from '../components/CityAutocomplete';
import { apiPostPublic } from '../api';
import logo from '../assets/images/logo.png';

// Types for API responses
interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
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

const visaTypes = ['H2B', 'J1', 'H1B', 'F1'];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateAccountPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    visa_type: '',
    current_location: {
      city: '',
      state: '',
      country: 'USA',
    },
    occupation: '',
    employer: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.first_name.trim())
      newErrors.first_name = 'First name is required.';
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    else if (!emailRegex.test(form.email))
      newErrors.email = 'Invalid email address.';
    if (!form.password) newErrors.password = 'Password is required.';
    else if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.visa_type) newErrors.visa_type = 'Visa type is required.';
    if (
      !form.current_location.city.trim() ||
      !form.current_location.state.trim()
    ) {
      newErrors.current_location = 'Location is required.';
    }
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateStep1();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateStep2();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setApiError('');

    try {
      // Register user with the new API endpoint
      const response = await apiPostPublic<RegisterResponse>(
        '/api/auth/register',
        {
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          visa_type: form.visa_type,
          current_location: form.current_location,
          occupation: form.occupation,
          employer: form.employer,
        }
      );

      // Store user data (no token - user needs to log in)
      if (response.data) {
        localStorage.setItem(
          'userData',
          JSON.stringify({
            uid: response.data.id,
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
          })
        );
      }

      // Navigate to account created page
      navigate('/account-created');
    } catch (error: any) {
      setApiError(error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 pt-8 pb-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-4">
          <img src={logo} alt="VisaConnect Logo" className="h-16 w-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1 mt-2 text-center">
          Create Account
        </h1>
        <p className="text-gray-500 text-center text-base mb-6">
          {step === 1 ? 'General information' : 'Additional information'}
        </p>

        {apiError && (
          <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-red-600 text-sm">{apiError}</p>
          </div>
        )}

        <div className="relative w-full">
          {step === 1 ? (
            <form
              className="w-full flex flex-col transition-all duration-500 opacity-100 translate-x-0 z-10"
              onSubmit={handleContinue}
              style={{ minHeight: 340 }}
            >
              <Input
                name="first_name"
                placeholder="First name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
              {errors.first_name && (
                <span className="text-red-500 text-sm mb-2">
                  {errors.first_name}
                </span>
              )}
              <Input
                name="last_name"
                placeholder="Last name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
              {errors.last_name && (
                <span className="text-red-500 text-sm mb-2">
                  {errors.last_name}
                </span>
              )}
              <Input
                name="email"
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <span className="text-red-500 text-sm mb-2">
                  {errors.email}
                </span>
              )}
              <Input
                name="password"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <span className="text-red-500 text-sm mb-2">
                  {errors.password}
                </span>
              )}
              <Input
                name="confirmPassword"
                placeholder="Confirm password"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm mb-2">
                  {errors.confirmPassword}
                </span>
              )}
              <div className="mt-8">
                <Button type="submit" variant="primary">
                  Continue
                </Button>
              </div>
            </form>
          ) : (
            <form
              className="w-full flex flex-col transition-all duration-500 opacity-100 translate-x-0 z-10"
              onSubmit={handleSubmit}
              style={{ minHeight: 340 }}
            >
              <div className="relative mb-4">
                <select
                  name="visa_type"
                  value={form.visa_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-sky-300 appearance-none"
                >
                  <option value="" disabled>
                    Current Visa Type (e.g. H2B, J1, H1B, F1)
                  </option>
                  {visaTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▲
                </span>
                {errors.visa_type && (
                  <span className="text-red-500 text-sm block mt-2">
                    {errors.visa_type}
                  </span>
                )}
              </div>
              <CityAutocomplete
                value={
                  form.current_location.city && form.current_location.state
                    ? `${form.current_location.city}, ${form.current_location.state}`
                    : ''
                }
                onChange={(value) => {
                  const [city, state] = value.split(', ').map((s) => s.trim());
                  setForm({
                    ...form,
                    current_location: {
                      ...form.current_location,
                      city: city || '',
                      state: state || '',
                    },
                  });
                }}
                placeholder="Location: City, state"
                required
              />
              {errors.current_location && (
                <span className="text-red-500 text-sm mb-2">
                  {errors.current_location}
                </span>
              )}
              <Input
                name="employer"
                placeholder="Current company/employer (optional)"
                value={form.employer}
                onChange={handleChange}
              />
              <Input
                name="occupation"
                placeholder="Current job position (optional)"
                value={form.occupation}
                onChange={handleChange}
              />
              <div className="mt-8">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Creating Account...' : 'Submit'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
