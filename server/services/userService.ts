import pool from '../db/config';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string; // Required
  first_name?: string;
  last_name?: string;
  visa_type?: string;
  current_location?: {
    city: string;
    state: string;
    country: string;
  };
  occupation?: string; // New field for job/employer
  employer?: string; // New field for company name

  // Optional profile fields
  interests?: string[];
  nationality?: string;
  languages?: string[];
  first_time_in_us_year?: number;
  first_time_in_us_location?: string;
  first_time_in_us_visa?: string;
  job_discovery_method?: string;
  visa_change_journey?: string;
  other_us_jobs?: string[];
  hobbies?: string[];
  favorite_state?: string;
  preferred_outings?: string[];
  has_car?: boolean;
  offers_rides?: boolean;
  relationship_status?: string;
  road_trips?: boolean;
  favorite_place?: string;
  travel_tips?: string;
  willing_to_guide?: boolean;
  mentorship_interest?: boolean;
  job_boards?: string[];
  visa_advice?: string;
  profile_photo_url?: string | null;
  profile_photo_public_id?: string | null;
  bio?: string;

  created_at?: Date;
  updated_at?: Date;
}

// Basic user data for initial registration
export interface BasicUserData {
  id?: string; // Optional ID for Firebase UID integration
  email: string; // Required
  first_name?: string;
  last_name?: string;
  visa_type?: string;
  current_location?: {
    city: string;
    state: string;
    country: string;
  };
  occupation?: string; // Job title/role
  employer?: string; // Company name
}

// Extended user data for profile updates (includes all fields)
export interface CreateUserData extends BasicUserData {
  // Optional profile fields - can be filled in later
  interests?: string[];
  nationality?: string;
  languages?: string[];
  first_time_in_us_year?: number;
  first_time_in_us_location?: string;
  first_time_in_us_visa?: string;
  job_discovery_method?: string;
  visa_change_journey?: string;
  other_us_jobs?: string[];
  hobbies?: string[];
  favorite_state?: string;
  preferred_outings?: string[];
  has_car?: boolean;
  offers_rides?: boolean;
  relationship_status?: string;
  road_trips?: boolean;
  favorite_place?: string;
  travel_tips?: string;
  willing_to_guide?: boolean;
  mentorship_interest?: boolean;
  job_boards?: string[];
  visa_advice?: string;
  profile_photo_url?: string | null;
  profile_photo_public_id?: string | null;
  bio?: string;
}

export class UserService {
  // Create a new user with basic information
  async createUser(userData: BasicUserData): Promise<User> {
    const id = userData.id || uuidv4();
    const query = `
              INSERT INTO users (
                id, email, first_name, last_name, visa_type, current_location, occupation, employer, created_at, updated_at
              )
              VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
              )
              RETURNING *
            `;

    const values = [
      id,
      userData.email,
      userData.first_name,
      userData.last_name,
      userData.visa_type,
      userData.current_location
        ? JSON.stringify(userData.current_location)
        : null,
      userData.occupation,
      userData.employer,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  // Update user with basic or detailed profile information
  async updateUser(
    id: string,
    updates: Partial<CreateUserData>
  ): Promise<User | null> {
    const setClause: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.first_name !== undefined) {
      setClause.push(`first_name = $${paramCount++}`);
      values.push(updates.first_name);
    }
    if (updates.last_name !== undefined) {
      setClause.push(`last_name = $${paramCount++}`);
      values.push(updates.last_name);
    }
    if (updates.visa_type !== undefined) {
      setClause.push(`visa_type = $${paramCount++}`);
      values.push(updates.visa_type);
    }
    if (updates.current_location !== undefined) {
      setClause.push(`current_location = $${paramCount++}`);
      values.push(JSON.stringify(updates.current_location));
    }
    if (updates.occupation !== undefined) {
      setClause.push(`occupation = $${paramCount++}`);
      values.push(updates.occupation);
    }
    if (updates.employer !== undefined) {
      setClause.push(`employer = $${paramCount++}`);
      values.push(updates.employer);
    }
    if (updates.interests !== undefined) {
      setClause.push(`interests = $${paramCount++}`);
      values.push(updates.interests);
    }

    // Background & Identity fields
    if (updates.nationality !== undefined) {
      setClause.push(`nationality = $${paramCount++}`);
      values.push(updates.nationality);
    }
    if (updates.languages !== undefined) {
      setClause.push(`languages = $${paramCount++}`);
      values.push(updates.languages);
    }
    if (updates.first_time_in_us_year !== undefined) {
      setClause.push(`first_time_in_us_year = $${paramCount++}`);
      values.push(updates.first_time_in_us_year);
    }
    if (updates.first_time_in_us_location !== undefined) {
      setClause.push(`first_time_in_us_location = $${paramCount++}`);
      values.push(updates.first_time_in_us_location);
    }
    if (updates.first_time_in_us_visa !== undefined) {
      setClause.push(`first_time_in_us_visa = $${paramCount++}`);
      values.push(updates.first_time_in_us_visa);
    }
    if (updates.job_discovery_method !== undefined) {
      setClause.push(`job_discovery_method = $${paramCount++}`);
      values.push(updates.job_discovery_method);
    }
    if (updates.visa_change_journey !== undefined) {
      setClause.push(`visa_change_journey = $${paramCount++}`);
      values.push(updates.visa_change_journey);
    }
    if (updates.other_us_jobs !== undefined) {
      setClause.push(`other_us_jobs = $${paramCount++}`);
      values.push(updates.other_us_jobs);
    }

    // Lifestyle & Personality fields
    if (updates.hobbies !== undefined) {
      setClause.push(`hobbies = $${paramCount++}`);
      values.push(updates.hobbies);
    }
    if (updates.favorite_state !== undefined) {
      setClause.push(`favorite_state = $${paramCount++}`);
      values.push(updates.favorite_state);
    }
    if (updates.preferred_outings !== undefined) {
      setClause.push(`preferred_outings = $${paramCount++}`);
      values.push(updates.preferred_outings);
    }
    if (updates.has_car !== undefined) {
      setClause.push(`has_car = $${paramCount++}`);
      values.push(updates.has_car);
    }
    if (updates.offers_rides !== undefined) {
      setClause.push(`offers_rides = $${paramCount++}`);
      values.push(updates.offers_rides);
    }
    if (updates.relationship_status !== undefined) {
      setClause.push(`relationship_status = $${paramCount++}`);
      values.push(updates.relationship_status);
    }

    // Travel & Exploration fields
    if (updates.road_trips !== undefined) {
      setClause.push(`road_trips = $${paramCount++}`);
      values.push(updates.road_trips);
    }
    if (updates.favorite_place !== undefined) {
      setClause.push(`favorite_place = $${paramCount++}`);
      values.push(updates.favorite_place);
    }
    if (updates.travel_tips !== undefined) {
      setClause.push(`travel_tips = $${paramCount++}`);
      values.push(updates.travel_tips);
    }
    if (updates.willing_to_guide !== undefined) {
      setClause.push(`willing_to_guide = $${paramCount++}`);
      values.push(updates.willing_to_guide);
    }

    // Knowledge & Community fields
    if (updates.mentorship_interest !== undefined) {
      setClause.push(`mentorship_interest = $${paramCount++}`);
      values.push(updates.mentorship_interest);
    }
    if (updates.job_boards !== undefined) {
      setClause.push(`job_boards = $${paramCount++}`);
      values.push(updates.job_boards);
    }
    if (updates.visa_advice !== undefined) {
      setClause.push(`visa_advice = $${paramCount++}`);
      values.push(updates.visa_advice);
    }

    if (updates.profile_photo_url !== undefined) {
      setClause.push(`profile_photo_url = $${paramCount++}`);
      values.push(updates.profile_photo_url);
    }
    if (updates.profile_photo_public_id !== undefined) {
      setClause.push(`profile_photo_public_id = $${paramCount++}`);
      values.push(updates.profile_photo_public_id);
    }
    if (updates.bio !== undefined) {
      setClause.push(`bio = $${paramCount++}`);
      values.push(updates.bio);
    }

    if (setClause.length === 0) {
      return this.getUserById(id);
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Update detailed profile information
  async updateProfileDetails(
    id: string,
    profileData: Partial<CreateUserData>
  ): Promise<User | null> {
    const setClause: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Profile detail fields
    if (profileData.interests !== undefined) {
      setClause.push(`interests = $${paramCount++}`);
      values.push(profileData.interests);
    }
    if (profileData.nationality !== undefined) {
      setClause.push(`nationality = $${paramCount++}`);
      values.push(profileData.nationality);
    }
    if (profileData.languages !== undefined) {
      setClause.push(`languages = $${paramCount++}`);
      values.push(profileData.languages);
    }
    if (profileData.first_time_in_us_year !== undefined) {
      setClause.push(`first_time_in_us_year = $${paramCount++}`);
      values.push(profileData.first_time_in_us_year);
    }
    if (profileData.first_time_in_us_location !== undefined) {
      setClause.push(`first_time_in_us_location = $${paramCount++}`);
      values.push(profileData.first_time_in_us_location);
    }
    if (profileData.first_time_in_us_visa !== undefined) {
      setClause.push(`first_time_in_us_visa = $${paramCount++}`);
      values.push(profileData.first_time_in_us_visa);
    }
    if (profileData.job_discovery_method !== undefined) {
      setClause.push(`job_discovery_method = $${paramCount++}`);
      values.push(profileData.job_discovery_method);
    }
    if (profileData.visa_change_journey !== undefined) {
      setClause.push(`visa_change_journey = $${paramCount++}`);
      values.push(profileData.visa_change_journey);
    }
    if (profileData.other_us_jobs !== undefined) {
      setClause.push(`other_us_jobs = $${paramCount++}`);
      values.push(profileData.other_us_jobs);
    }
    if (profileData.hobbies !== undefined) {
      setClause.push(`hobbies = $${paramCount++}`);
      values.push(profileData.hobbies);
    }
    if (profileData.favorite_state !== undefined) {
      setClause.push(`favorite_state = $${paramCount++}`);
      values.push(profileData.favorite_state);
    }
    if (profileData.preferred_outings !== undefined) {
      setClause.push(`preferred_outings = $${paramCount++}`);
      values.push(profileData.preferred_outings);
    }
    if (profileData.has_car !== undefined) {
      setClause.push(`has_car = $${paramCount++}`);
      values.push(profileData.has_car);
    }
    if (profileData.offers_rides !== undefined) {
      setClause.push(`offers_rides = $${paramCount++}`);
      values.push(profileData.offers_rides);
    }
    if (profileData.relationship_status !== undefined) {
      setClause.push(`relationship_status = $${paramCount++}`);
      values.push(profileData.relationship_status);
    }
    if (profileData.road_trips !== undefined) {
      setClause.push(`road_trips = $${paramCount++}`);
      values.push(profileData.road_trips);
    }
    if (profileData.favorite_place !== undefined) {
      setClause.push(`favorite_place = $${paramCount++}`);
      values.push(profileData.favorite_place);
    }
    if (profileData.travel_tips !== undefined) {
      setClause.push(`travel_tips = $${paramCount++}`);
      values.push(profileData.travel_tips);
    }
    if (profileData.willing_to_guide !== undefined) {
      setClause.push(`willing_to_guide = $${paramCount++}`);
      values.push(profileData.willing_to_guide);
    }
    if (profileData.mentorship_interest !== undefined) {
      setClause.push(`mentorship_interest = $${paramCount++}`);
      values.push(profileData.mentorship_interest);
    }
    if (profileData.job_boards !== undefined) {
      setClause.push(`job_boards = $${paramCount++}`);
      values.push(profileData.job_boards);
    }
    if (profileData.visa_advice !== undefined) {
      setClause.push(`visa_advice = $${paramCount++}`);
      values.push(profileData.visa_advice);
    }
    if (profileData.profile_photo_url !== undefined) {
      setClause.push(`profile_photo_url = $${paramCount++}`);
      values.push(profileData.profile_photo_url);
    }
    if (profileData.profile_photo_public_id !== undefined) {
      setClause.push(`profile_photo_public_id = $${paramCount++}`);
      values.push(profileData.profile_photo_public_id);
    }

    if (setClause.length === 0) {
      return this.getUserById(id);
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Get all users (with pagination)
  async getAllUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
    const query =
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  // Search users by criteria
  async searchUsers(criteria: {
    visa_type?: string;
    location?: { city?: string; state?: string; country?: string };
    interests?: string[];
  }): Promise<User[]> {
    let query = 'SELECT * FROM users WHERE 1=1';
    const values: any[] = [];
    let paramCount = 1;

    if (criteria.visa_type) {
      query += ` AND visa_type = $${paramCount++}`;
      values.push(criteria.visa_type);
    }

    if (criteria.location) {
      if (criteria.location.country) {
        query += ` AND current_location->>'country' = $${paramCount++}`;
        values.push(criteria.location.country);
      }
      if (criteria.location.state) {
        query += ` AND current_location->>'state' = $${paramCount++}`;
        values.push(criteria.location.state);
      }
      if (criteria.location.city) {
        query += ` AND current_location->>'city' = $${paramCount++}`;
        values.push(criteria.location.city);
      }
    }

    if (criteria.interests && criteria.interests.length > 0) {
      query += ` AND interests && $${paramCount++}`;
      values.push(criteria.interests);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Search users by text query (for Connect screen)
  async searchUsersByText(
    searchQuery: string,
    currentUserId: string
  ): Promise<User[]> {
    const query = `
      SELECT id, first_name, last_name, visa_type, current_location, occupation, 
             profile_photo_url, bio, created_at
      FROM users 
      WHERE id != $1 
        AND (
          LOWER(first_name) LIKE LOWER($2) OR
          LOWER(last_name) LIKE LOWER($2) OR
          LOWER(occupation) LIKE LOWER($2) OR
          LOWER(visa_type) LIKE LOWER($2) OR
          LOWER(current_location::text) LIKE LOWER($2) OR
          LOWER(bio) LIKE LOWER($2)
        )
      ORDER BY 
        CASE 
          WHEN LOWER(first_name) LIKE LOWER($2) OR LOWER(last_name) LIKE LOWER($2) THEN 1
          WHEN LOWER(occupation) LIKE LOWER($2) THEN 2
          WHEN LOWER(visa_type) LIKE LOWER($2) THEN 3
          ELSE 4
        END,
        created_at DESC
      LIMIT 20
    `;

    const searchTerm = `%${searchQuery}%`;
    const result = await pool.query(query, [currentUserId, searchTerm]);
    return result.rows;
  }
}

export default new UserService();
