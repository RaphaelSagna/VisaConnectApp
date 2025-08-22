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
- **full_name**: VARCHAR(255)
- **email**: VARCHAR(255) UNIQUE NOT NULL
- **visa_type**: VARCHAR(50)
- **current_location**: JSONB {city, state, country}
- **interests**: TEXT[] (Array of interests)
- **profile_photo_url**: VARCHAR(500) (URL to profile photo)
- **profile_photo_public_id**: VARCHAR(255) (Cloudinary public ID)
- **bio**: TEXT (User bio/description)
- **created_at**: TIMESTAMP DEFAULT NOW()
- **updated_at**: TIMESTAMP DEFAULT NOW()

### Businesses Table

- **id**: SERIAL (Primary Key)
- **user_id**: VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **name**: VARCHAR(255) NOT NULL (Business name)
- **description**: TEXT (Business description)
- **address**: TEXT (Business address)
- **website**: VARCHAR(500) (Business website URL)
- **verified**: BOOLEAN DEFAULT FALSE (Verification status)
- **created_at**: TIMESTAMP DEFAULT NOW()
- **updated_at**: TIMESTAMP DEFAULT NOW()
- **UNIQUE(user_id, name)**: Prevents duplicate business names per user

### Indexes

- Email lookup: `idx_users_email`
- Visa type filtering: `idx_users_visa_type`
- Geographic queries: `idx_users_location` (GIN)
- Array searches: `idx_users_interests` (GIN)
- Profile photo: `idx_users_profile_photo_url`, `idx_users_profile_photo_public_id`
- Bio: `idx_users_bio`

#### Businesses Table Indexes

- User lookup: `idx_businesses_user_id`
- Name search: `idx_businesses_name`
- Verification status: `idx_businesses_verified`

### Triggers

- **update_users_updated_at**: Automatically updates `updated_at` timestamp for users table
- **update_businesses_updated_at**: Automatically updates `updated_at` timestamp for businesses table

## Usage

### Import the User Service

```typescript
import userService from '../services/userService';

// Create a user
const user = await userService.createUser({
  email: 'user@example.com',
  full_name: 'John Doe',
  visa_type: 'H1B',
});

// Get user by ID
const user = await userService.getUserById('uuid-here');

// Update profile section
await userService.updateProfileSection('uuid-here', 'background_identity', {
  nationality: 'Indian',
  age: 28,
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
