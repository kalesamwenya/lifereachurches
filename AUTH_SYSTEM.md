# Authentication System Documentation

## Overview
Complete member authentication and registration system with PHP backend APIs and Next.js frontend.

## Backend APIs (PHP)

### 1. Register - `POST /auth/register.php`
Creates a new member account.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "555-1234" (optional)
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  }
}
```

**Validation:**
- All fields except phone are required
- Email must be valid format
- Password minimum 8 characters
- Email uniqueness check

### 2. Login - `POST /auth/login.php`
Authenticates member and returns user data + token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "role": "member",
      "membership_status": "active"
    },
    "token": "abc123...",
    "expires_in": 86400
  }
}
```

### 3. Get Current User - `GET /auth/me.php`
Returns authenticated user details.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
user_id=1
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "role": "member",
    "membership_status": "active",
    "created_at": "2026-01-27T00:00:00Z"
  }
}
```

## Frontend Components

### 1. AuthContext (`frontend/context/AuthContext.jsx`)
React Context for managing authentication state.

**Usage:**
```jsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, login, logout, register, isAuthenticated } = useAuth();
  
  // Use authentication methods
}
```

**Methods:**
- `login(email, password)` - Authenticate user
- `register(userData)` - Create new account
- `logout()` - Sign out user
- `updateUser(updatedUser)` - Update user state

**State:**
- `user` - Current user object or null
- `token` - Auth token
- `loading` - Loading state
- `isAuthenticated` - Boolean auth status

### 2. Login Page (`/login`)
- Email/password form
- Error handling
- Redirect to home after login
- Link to registration

### 3. Register Page (`/register`)
- Full registration form
- Password confirmation
- Terms acceptance checkbox
- Validation and error display
- Success state with redirect

### 4. Profile Page (`/profile`)
- Display user information
- Protected route (requires login)
- Shows all profile fields
- Edit button (functionality TBD)

### 5. ProtectedRoute Component
Wrapper for pages requiring authentication.

**Usage:**
```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* Protected content */}
    </ProtectedRoute>
  );
}
```

### 6. UserMenu Component
Navigation dropdown for authenticated users.

**Features:**
- User avatar with initials
- Profile link
- Settings link
- Logout button
- Shows login/register buttons when not authenticated

**Usage:**
```jsx
import UserMenu from '@/components/UserMenu';

<UserMenu />
```

## Integration Example

### Add to Navbar:
```jsx
import UserMenu from '@/components/UserMenu';

export default function Navbar() {
  return (
    <nav>
      {/* Other nav items */}
      <UserMenu />
    </nav>
  );
}
```

### Protect a Page:
```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

### Access User in Component:
```jsx
import { useAuth } from '@/context/AuthContext';

export default function Welcome() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }
  
  return <p>Welcome, {user.first_name}!</p>;
}
```

## Database Table

The system uses the `members` table:

```sql
CREATE TABLE members (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'member',
  membership_status ENUM('active', 'inactive') DEFAULT 'active',
  date_of_birth DATE,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Notes

1. **Password Hashing**: Uses PHP's `password_hash()` with bcrypt
2. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
3. **Session Management**: Simple token-based (implement JWT or sessions table for production)
4. **CORS**: Configured in `api/config/headers.php`
5. **Input Validation**: Server-side validation on all endpoints

## Production Improvements

1. **Implement JWT**: Replace simple tokens with JWT
2. **Add Sessions Table**: Track active sessions
3. **Refresh Tokens**: Implement token refresh mechanism
4. **Email Verification**: Add email confirmation flow
5. **Password Reset**: Implement forgot password functionality
6. **Rate Limiting**: Add login attempt limits
7. **2FA**: Optional two-factor authentication
8. **httpOnly Cookies**: Store tokens in secure cookies instead of localStorage

## Routes

- `/login` - Login page
- `/register` - Registration page
- `/profile` - User profile (protected)
- `/settings` - User settings (protected)

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `409` - Conflict (email already exists)
- `500` - Server Error
