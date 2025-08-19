-- Initialize VisaConnect database
-- Run this script to create the necessary tables

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    visa_type VARCHAR(50),
    current_location JSONB, -- {city, state, country}
    interests TEXT[], -- Array of interests
    profile_answers JSONB, -- All profile sections (background_identity, lifestyle_personality, etc.)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on visa_type for filtering
CREATE INDEX IF NOT EXISTS idx_users_visa_type ON users(visa_type);

-- Create index on current_location for geographic queries
CREATE INDEX IF NOT EXISTS idx_users_location ON users USING GIN(current_location);

-- Create index on interests for array searches
CREATE INDEX IF NOT EXISTS idx_users_interests ON users USING GIN(interests);

-- Create index on profile_answers for JSON queries
CREATE INDEX IF NOT EXISTS idx_users_profile_answers ON users USING GIN(profile_answers);

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

-- Insert sample data (optional)
-- INSERT INTO users (id, full_name, email, visa_type, current_location, interests, profile_answers) VALUES
-- (
--     gen_random_uuid(),
--     'John Doe',
--     'john@example.com',
--     'H1B',
--     '{"city": "San Francisco", "state": "CA", "country": "USA"}',
--     ARRAY['technology', 'immigration', 'networking'],
--     '{"background_identity": {"nationality": "Indian", "age": 28}, "lifestyle_personality": {"personality": "extrovert"}}'
-- );
