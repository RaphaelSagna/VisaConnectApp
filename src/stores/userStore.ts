import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User data interface
export interface UserData {
  uid: string;
  email: string;
  first_name?: string;
  last_name?: string;
  visa_type?: string;
  current_location?: {
    city?: string;
    state?: string;
    country?: string;
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
}

// Store interface
interface UserStore {
  // State
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  init: () => void;
  setUser: (user: UserData) => void;
  updateUser: (updates: Partial<UserData>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;

  // Computed values
  getFullName: () => string;
  getLocation: () => string;
  getCompletion: () => { completed: number; total: number; percentage: number };
}

// Create the store
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initialize from localStorage for backward compatibility
      init: () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            set({ user, isAuthenticated: true });
          } catch (error) {
            console.error(
              'Failed to parse user data from localStorage:',
              error
            );
          }
        }
      },
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user: UserData) => {
        set({ user, isAuthenticated: true });
        // Also update localStorage for backward compatibility
        localStorage.setItem('userData', JSON.stringify(user));
      },

      updateUser: (updates: Partial<UserData>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          // Update localStorage
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
      },

      clearUser: () => {
        set({ user: null, isAuthenticated: false });
        // Clear localStorage
        localStorage.removeItem('userData');
        localStorage.removeItem('userToken');
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Computed values
      getFullName: () => {
        const user = get().user;
        if (!user) return '';
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        return `${firstName} ${lastName}`.trim() || 'User';
      },

      getLocation: () => {
        const user = get().user;
        if (!user?.current_location) return '';
        const { city, state } = user.current_location;
        if (city && state) return `${city}, ${state}`;
        if (city) return city;
        if (state) return state;
        return '';
      },

      getCompletion: () => {
        const user = get().user;
        if (!user) return { completed: 0, total: 5, percentage: 0 };

        let completed = 0;
        const total = 5;

        // 1. Basic Info (visa type, location, occupation, employer)
        if (
          user.visa_type &&
          user.current_location?.city &&
          user.current_location?.state
        ) {
          completed++;
        }

        // 2. Background & Identity
        if (
          user.nationality &&
          user.languages &&
          user.languages.length > 0 &&
          user.other_us_jobs &&
          user.other_us_jobs.length > 0 &&
          user.relationship_status
        ) {
          completed++;
        }

        // 3. Lifestyle & Personality
        if (
          user.hobbies &&
          user.hobbies.length > 0 &&
          user.favorite_state &&
          user.preferred_outings &&
          user.preferred_outings.length > 0 &&
          user.has_car !== undefined &&
          user.offers_rides !== undefined
        ) {
          completed++;
        }

        // 4. Travel & Exploration
        if (
          user.road_trips !== undefined &&
          user.favorite_place &&
          user.travel_tips &&
          user.willing_to_guide !== undefined
        ) {
          completed++;
        }

        // 5. Knowledge & Community
        if (
          user.mentorship_interest !== undefined &&
          user.job_boards &&
          user.job_boards.length > 0 &&
          user.visa_advice
        ) {
          completed++;
        }

        const percentage = Math.floor((completed / total) * 100);
        return { completed, total, percentage };
      },
    }),
    {
      name: 'user-storage', // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these fields
    }
  )
);
