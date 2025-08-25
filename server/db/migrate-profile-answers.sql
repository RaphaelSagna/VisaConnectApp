-- Migration script to remove profile_answers and add new profile fields
-- Run this script to update the existing database schema

-- Add new profile fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo_public_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    website VARCHAR(500),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, name) -- Prevent duplicate business names per user
);

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_users_profile_photo_url ON users(profile_photo_url);
CREATE INDEX IF NOT EXISTS idx_users_profile_photo_public_id ON users(profile_photo_public_id);
CREATE INDEX IF NOT EXISTS idx_users_bio ON users(bio);

-- Create indexes for businesses table
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses(name);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON businesses(verified);

-- Migrate existing data from profile_answers (if any exists)
-- This will extract bio and photo information from the JSONB field
UPDATE users 
SET 
  bio = COALESCE(profile_answers->>'bio', bio),
  profile_photo_url = COALESCE(profile_answers->>'profileImage', profile_photo_url),
  profile_photo_public_id = COALESCE(profile_answers->>'profileImagePublicId', profile_photo_public_id)
WHERE profile_answers IS NOT NULL;

-- Migrate business data from profile_answers to businesses table
INSERT INTO businesses (user_id, name, description, address, website, verified)
SELECT 
  id as user_id,
  profile_answers->'business'->>'name' as name,
  profile_answers->'business'->>'description' as description,
  profile_answers->'business'->>'address' as address,
  profile_answers->'business'->>'website' as website,
  false as verified
FROM users 
WHERE profile_answers IS NOT NULL 
  AND profile_answers->'business'->>'name' IS NOT NULL
  AND profile_answers->'business'->>'name' != ''
ON CONFLICT (user_id, name) DO NOTHING;

-- Remove the profile_answers column
ALTER TABLE users DROP COLUMN IF EXISTS profile_answers;

-- Drop the old index
DROP INDEX IF EXISTS idx_users_profile_answers;

-- Verify the migration
SELECT 
  'Migration completed successfully' as status,
  COUNT(*) as total_users,
  COUNT(profile_photo_url) as users_with_photos,
  COUNT(bio) as users_with_bio
FROM users;

-- Check businesses table
SELECT 
  'Businesses table' as table_name,
  COUNT(*) as total_businesses,
  COUNT(verified) as verified_businesses
FROM businesses;
