# PostgreSQL Database Setup for VisaConnect

## Prerequisites

1. **PostgreSQL** installed and running on your system
2. **Node.js** and **Yarn** installed
3. **Environment variables** configured

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
yarn install
```

### 2. Configure Environment Variables

Copy the environment template and configure your database:

```bash
cp env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=visaconnect
DB_PASSWORD=your_actual_password
DB_PORT=5432
```

### 3. Create Database

Connect to PostgreSQL and create the database:

```sql
CREATE DATABASE visaconnect;
```

### 4. Initialize Database Tables

Run the initialization script:

```bash
# Build TypeScript
yarn build

# Run initialization
node dist/db/init.js
```

Or run directly with ts-node:

```bash
yarn ts-node db/init.ts
```

## Database Schema

### Users Table

- **id**: UUID (Primary Key)
- **email**: VARCHAR(255) UNIQUE NOT NULL
- **first_name**: VARCHAR(255)
- **last_name**: VARCHAR(255)
- **visa_type**: VARCHAR(50)
- **current_location**: JSONB {city, state, country}
- **occupation**: VARCHAR(255) (Job title/role)
- **employer**: VARCHAR(255) (Company name)
- **interests**: TEXT[] (Array of interests)
- **nationality**: VARCHAR(100)
- **languages**: TEXT[] (Array of languages)
- **first_time_in_us_year**: INTEGER
- **first_time_in_us_location**: VARCHAR(255)
- **first_time_in_us_visa**: VARCHAR(100)
- **job_discovery_method**: VARCHAR(255)
- **visa_change_journey**: TEXT
- **other_us_jobs**: TEXT[] (Array of other US jobs)
- **hobbies**: TEXT[] (Array of hobbies)
- **favorite_state**: VARCHAR(100)
- **preferred_outings**: TEXT[] (Array of preferred outings)
- **has_car**: BOOLEAN
- **offers_rides**: BOOLEAN
- **relationship_status**: VARCHAR(100)
- **road_trips**: BOOLEAN
- **favorite_place**: VARCHAR(255)
- **travel_tips**: TEXT
- **willing_to_guide**: BOOLEAN
- **mentorship_interest**: BOOLEAN
- **job_boards**: TEXT[] (Array of job boards)
- **visa_advice**: TEXT
- **profile_photo_url**: VARCHAR(500) (URL to profile photo)
- **profile_photo_public_id**: VARCHAR(255) (Cloudinary public ID)
- **bio**: TEXT (User bio/description)
- **created_at**: TIMESTAMP DEFAULT NOW()
- **updated_at**: TIMESTAMP DEFAULT NOW()

### Indexes

- Email lookup: `idx_users_email`
- Name fields: `idx_users_first_name`, `idx_users_last_name`
- Visa type filtering: `idx_users_visa_type`
- Geographic queries: `idx_users_location` (GIN)
- Occupation/employer: `idx_users_occupation`, `idx_users_employer`
- Array searches: `idx_users_interests` (GIN), `idx_users_languages` (GIN), `idx_users_hobbies` (GIN), `idx_users_preferred_outings` (GIN), `idx_users_job_boards` (GIN)
- Profile photo: `idx_users_profile_photo_url`, `idx_users_profile_photo_public_id`
- Bio: `idx_users_bio`
- Other fields: `idx_users_nationality`, `idx_users_first_time_in_us_year`, `idx_users_job_discovery_method`, `idx_users_favorite_state`, `idx_users_has_car`, `idx_users_offers_rides`, `idx_users_relationship_status`, `idx_users_road_trips`, `idx_users_favorite_place`, `idx_users_willing_to_guide`, `idx_users_mentorship_interest`, `idx_users_visa_advice`

### Triggers

- **update_users_updated_at**: Automatically updates `updated_at` timestamp for users table

## Usage

### Import the User Service

```typescript
import userService from '../services/userService';

// Create a user
const user = await userService.createUser({
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  visa_type: 'H1B',
});

// Get user by ID
const user = await userService.getUserById('uuid-here');

// Update user
await userService.updateUser('uuid-here', {
  bio: 'Updated bio',
  profile_photo_url: 'https://example.com/photo.jpg',
});
```

## Testing Connection

Test your database connection:

```bash
yarn ts-node db/init.ts
```

You should see:

```
Database connection test successful: { now: '2024-01-XX...' }
Database initialized successfully!
Users table created with all necessary indexes and triggers.
```

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure PostgreSQL is running
2. **Authentication Failed**: Check username/password in `.env`
3. **Database Not Found**: Create the database first
4. **Permission Denied**: Ensure user has proper permissions

### Useful Commands

```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql

# Connect to PostgreSQL
psql -U postgres -d visaconnect

# List tables
\dt

# Describe users table
\d users
```
