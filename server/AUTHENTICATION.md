# Hybrid Authentication System

VisaConnect uses a hybrid authentication approach combining **Firebase Auth** for authentication with **PostgreSQL** for user data storage.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Firebase Auth  │    │   PostgreSQL    │
│                 │    │                  │    │                 │
│ • Login Form    │───▶│ • User Accounts  │───▶│ • User Profiles │
│ • Registration  │    │ • JWT Tokens     │    │ • Visa Data     │
│ • Profile Mgmt  │    │ • Email Verify   │    │ • Preferences   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## How It Works

### 1. **User Registration**

```typescript
// 1. Create Firebase user account
const firebaseUser = await admin.auth().createUser({
  email: userData.email,
  password: userData.password,
  displayName: userData.full_name,
});

// 2. Create PostgreSQL user profile with essential fields only
const userProfile = await userService.createUser({
  id: firebaseUser.uid, // Use Firebase UID as primary key
  email: userData.email,
  full_name: userData.full_name,
  visa_type: userData.visa_type,
  current_location: userData.current_location,
  occupation: userData.occupation,
  employer: userData.employer,
  // All other profile fields are optional and can be filled in later
});

// 3. Generate custom token for immediate login
const customToken = await admin.auth().createCustomToken(firebaseUser.uid);
```

### 2. **User Login**

```typescript
// 1. Verify Firebase credentials
const firebaseUser = await admin.auth().getUserByEmail(email);

// 2. Get user profile from PostgreSQL
const userProfile = await userService.getUserById(firebaseUser.uid);

// 3. Generate custom token
const customToken = await admin.auth().createCustomToken(firebaseUser.uid);
```

### 3. **Authentication Flow**

```typescript
// Frontend sends JWT token in Authorization header
Authorization: Bearer <firebase-jwt-token>

// Backend verifies token using Firebase Admin SDK
const decodedToken = await admin.auth().verifyIdToken(token);

// User info is added to request object
req.user = {
  uid: decodedToken.uid,
  email: decodedToken.email,
  emailVerified: decodedToken.email_verified
};
```

## Registration Requirements

### **Essential Fields (Required)**

- `email`: User's email address
- `password`: User's password

### **Basic Profile Fields (Optional but Recommended)**

- `full_name`: User's full name
- `visa_type`: Type of visa (e.g., H1B, F1, OPT)
- `current_location`: JSON object with city, state, country
- `occupation`: Job title or role
- `employer`: Company name

### **Detailed Profile Fields (Collected Later)**

All other profile fields like interests, hobbies, travel preferences, etc. are collected later through profile updates using the `/api/auth/profile/details` endpoint.

## API Endpoints

### Authentication Routes

| Method   | Endpoint                    | Description              | Auth Required |
| -------- | --------------------------- | ------------------------ | ------------- |
| `POST`   | `/api/auth/register`        | User registration        | No            |
| `POST`   | `/api/auth/login`           | User login               | No            |
| `GET`    | `/api/auth/me`              | Get current user profile | Yes           |
| `PUT`    | `/api/auth/profile`         | Update basic profile     | Yes           |
| `PUT`    | `/api/auth/profile/details` | Update detailed profile  | Yes           |
| `POST`   | `/api/auth/verify-email`    | Verify email address     | Yes           |
| `POST`   | `/api/auth/forgot-password` | Request password reset   | No            |
| `DELETE` | `/api/auth/account`         | Delete user account      | Yes           |

### Protected Routes

| Method  | Endpoint                 | Description             | Auth Required        |
| ------- | ------------------------ | ----------------------- | -------------------- |
| `GET`   | `/api/auth/protected`    | Example protected route | Yes + Email Verified |
| `GET`   | `/api/user/:uid/profile` | Get user profile        | Yes                  |
| `PATCH` | `/api/user/:uid/*`       | Update profile sections | Yes                  |

## Middleware

### `authenticateUser`

- Verifies Firebase JWT tokens
- Adds user info to `req.user`
- Returns 401 for invalid/missing tokens

### `optionalAuth`

- Similar to `authenticateUser` but doesn't fail requests
- Useful for routes that work with or without authentication

### `requireEmailVerification`

- Ensures user's email is verified
- Returns 403 for unverified emails

## Frontend Integration

### 1. **Store Firebase Token**

```typescript
// After successful login
const token = await user.getIdToken();
localStorage.setItem('authToken', token);
```

### 2. **Include Token in Requests**

```typescript
const response = await fetch('/api/auth/me', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
  },
});
```

### 3. **Handle Token Expiration**

```typescript
if (response.status === 401) {
  // Token expired, redirect to login
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}
```

## Security Features

✅ **JWT Token Verification**: All protected routes verify Firebase tokens  
✅ **Email Verification**: Optional email verification requirement  
✅ **Password Security**: Firebase handles password hashing and security  
✅ **Rate Limiting**: Can be added to prevent brute force attacks  
✅ **CORS Protection**: Configured for your frontend domain

## Error Handling

### Common Error Codes

- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (email not verified)
- `409`: Conflict (user already exists)
- `500`: Internal server error

### Error Response Format

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

## Database Schema

The PostgreSQL users table includes all profile fields:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,                    -- Firebase UID
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  visa_type VARCHAR(50),

  -- Background & Identity
  nationality VARCHAR(100),
  languages TEXT[],
  first_time_in_us_year INTEGER,
  -- ... more fields

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Benefits of This Approach

✅ **Best of Both Worlds**: Firebase's auth + PostgreSQL's flexibility  
✅ **Scalable**: Both services handle millions of users  
✅ **Secure**: Firebase's battle-tested security  
✅ **Flexible**: PostgreSQL for complex queries and data relationships  
✅ **Cost Effective**: Firebase Auth free tier + minimal PostgreSQL costs  
✅ **Migration Path**: Can gradually move from Firestore to PostgreSQL

## Next Steps

1. **Test Authentication**: Use the health check endpoint `/api/health`
2. **Create User**: Test registration with `/api/auth/register`
3. **Login User**: Test authentication with `/api/auth/login`
4. **Frontend Integration**: Update your React app to use these endpoints
5. **Email Service**: Integrate with SendGrid/AWS SES for email verification

## Testing

Test the system with these curl commands:

```bash
# Health check
curl http://localhost:8080/api/health

# Register user (minimal required fields)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Register user (with basic profile)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User","visa_type":"H1B","current_location":{"city":"San Francisco","state":"CA","country":"USA"},"occupation":"Software Engineer","employer":"Tech Corp"}'

# Update detailed profile (after registration)
curl -X PUT http://localhost:8080/api/auth/profile/details \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"interests":["technology","immigration"],"hobbies":["hiking","cooking"],"nationality":"Indian","languages":["English","Hindi"]}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
