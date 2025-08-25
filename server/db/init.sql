-- Initialize VisaConnect database
-- Run this script to create the necessary tables

        -- Create users table
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(255) PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            visa_type VARCHAR(50),
            current_location JSONB, -- {city, state, country}
            occupation VARCHAR(255), -- Job title/role
            employer VARCHAR(255), -- Company name
            
            -- Optional profile fields (can be filled in later)
            interests TEXT[], -- Array of interests
            nationality VARCHAR(100),
            languages TEXT[], -- Array of languages
            first_time_in_us_year INTEGER,
            first_time_in_us_location VARCHAR(255),
            first_time_in_us_visa VARCHAR(100),
            job_discovery_method VARCHAR(255),
            visa_change_journey TEXT,
            other_us_jobs TEXT[], -- Array of other US jobs
            hobbies TEXT[], -- Array of hobbies
            favorite_state VARCHAR(100),
            preferred_outings TEXT[], -- Array of preferred outings
            has_car BOOLEAN,
            offers_rides BOOLEAN,
            relationship_status VARCHAR(100),
            road_trips BOOLEAN,
            favorite_place VARCHAR(255),
            travel_tips TEXT,
            willing_to_guide BOOLEAN,
            mentorship_interest BOOLEAN,
            job_boards TEXT[], -- Array of job boards
            visa_advice TEXT,
            
            -- Profile photo fields
            profile_photo_url VARCHAR(500), -- URL to the profile photo
            profile_photo_public_id VARCHAR(255), -- Cloudinary public ID for deletion
            
            -- Additional profile fields
            bio TEXT, -- User bio/description
            
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Create index on email for faster lookups
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

        -- Create indexes on name fields for searching
        CREATE INDEX IF NOT EXISTS idx_users_first_name ON users(first_name);
        CREATE INDEX IF NOT EXISTS idx_users_last_name ON users(last_name);

        -- Create index on visa_type for filtering
        CREATE INDEX IF NOT EXISTS idx_users_visa_type ON users(visa_type);

        -- Create index on current_location for geographic queries
        CREATE INDEX IF NOT EXISTS idx_users_location ON users USING GIN(current_location);

        -- Create indexes for new essential fields
        CREATE INDEX IF NOT EXISTS idx_users_occupation ON users(occupation);
        CREATE INDEX IF NOT EXISTS idx_users_employer ON users(employer);

-- Create index on interests for array searches
CREATE INDEX IF NOT EXISTS idx_users_interests ON users USING GIN(interests);

-- Create indexes for profile photo fields
CREATE INDEX IF NOT EXISTS idx_users_profile_photo_url ON users(profile_photo_url);
CREATE INDEX IF NOT EXISTS idx_users_profile_photo_public_id ON users(profile_photo_public_id);

-- Create indexes for additional profile fields
CREATE INDEX IF NOT EXISTS idx_users_bio ON users(bio);

-- Create indexes for new profile fields
CREATE INDEX IF NOT EXISTS idx_users_nationality ON users(nationality);
CREATE INDEX IF NOT EXISTS idx_users_languages ON users USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_users_first_time_in_us_year ON users(first_time_in_us_year);
CREATE INDEX IF NOT EXISTS idx_users_job_discovery_method ON users(job_discovery_method);
CREATE INDEX IF NOT EXISTS idx_users_hobbies ON users USING GIN(hobbies);
CREATE INDEX IF NOT EXISTS idx_users_favorite_state ON users(favorite_state);
CREATE INDEX IF NOT EXISTS idx_users_preferred_outings ON users USING GIN(preferred_outings);
CREATE INDEX IF NOT EXISTS idx_users_has_car ON users(has_car);
CREATE INDEX IF NOT EXISTS idx_users_offers_rides ON users(offers_rides);
CREATE INDEX IF NOT EXISTS idx_users_relationship_status ON users(relationship_status);
CREATE INDEX IF NOT EXISTS idx_users_road_trips ON users(road_trips);
CREATE INDEX IF NOT EXISTS idx_users_favorite_place ON users(favorite_place);
CREATE INDEX IF NOT EXISTS idx_users_willing_to_guide ON users(willing_to_guide);
CREATE INDEX IF NOT EXISTS idx_users_mentorship_interest ON users(mentorship_interest);
CREATE INDEX IF NOT EXISTS idx_users_job_boards ON users USING GIN(job_boards);
CREATE INDEX IF NOT EXISTS idx_users_visa_advice ON users(visa_advice);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
