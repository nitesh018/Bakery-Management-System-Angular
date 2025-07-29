# 🥖 Bakery Management System - API Requirements

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Authentication System](#authentication-system)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Validation Rules](#validation-rules)
6. [Error Handling](#error-handling)
7. [Security Requirements](#security-requirements)
8. [Testing Guidelines](#testing-guidelines)

---

## 🎯 Project Overview

**Project Name:** Bakery Management System  
**Frontend:** Angular 20+ with TypeScript  
**Expected Backend:** RESTful API with JSON responses  
**Authentication:** Dual login system (Users + Admins)

### System Features:
- **👤 User Registration & Login** - Customers can create accounts and login
- **👨‍💼 Admin Login Only** - Admins cannot self-register (managed separately)
- **🔐 Password Recovery** - Email-based password reset
- **📝 Form Validation** - Client-side validation with server-side verification

---

## 🔐 Authentication System

### User Types:
1. **Regular Users** - Customers who can register and login
2. **Admins** - System administrators (no self-registration allowed)

### Login Flow:
```
Frontend Toggle → User/Admin Selection → Different API Endpoints
```

---

## 🚀 API Endpoints

### 1. 👤 User Login
**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
  "userId": "string",
  "password": "string",
  "loginType": "user"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "john123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here",
    "expiresIn": 3600
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "INVALID_CREDENTIALS"
}
```

---

### 2. 👨‍💼 Admin Login
**Endpoint:** `POST /api/admin-login`

**Request Body:**
```json
{
  "userId": "string",
  "password": "string",
  "loginType": "admin"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "adminId": "admin001",
    "fullName": "Admin User",
    "email": "admin@bakery.com",
    "role": "admin",
    "permissions": ["manage_users", "manage_products", "view_reports"],
    "token": "jwt_admin_token_here",
    "expiresIn": 3600
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid admin credentials",
  "error": "INVALID_ADMIN_CREDENTIALS"
}
```

---

### 3. 📝 User Registration
**Endpoint:** `POST /api/signup`

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "userId": "string",
  "password": "string"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "userId": "john123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-07-28T10:30:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "userId": "User ID already exists",
    "email": "Email already registered"
  }
}
```

---

### 4. 🔄 Password Reset
**Endpoint:** `POST /api/forgot-password`

**Request Body:**
```json
{
  "email": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email",
  "data": {
    "email": "john@example.com",
    "resetTokenSent": true,
    "expiresIn": 900
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Email not found in our records",
  "error": "EMAIL_NOT_FOUND"
}
```

---

## 📊 Data Models

### User Model
```json
{
  "id": "auto-generated-id",
  "userId": "string (6-16 chars, alphanumeric)",
  "fullName": "string",
  "email": "string (valid email format)",
  "password": "string (hashed)",
  "role": "user",
  "isActive": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "lastLogin": "timestamp"
}
```

### Admin Model
```json
{
  "id": "auto-generated-id",
  "adminId": "string",
  "fullName": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "admin",
  "permissions": ["array of permissions"],
  "isActive": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "lastLogin": "timestamp"
}
```

---

## ✅ Validation Rules

### User ID Validation:
- **Length:** 6-16 characters
- **Characters:** Only letters and numbers (alphanumeric)
- **Uniqueness:** Must be unique across all users
- **Case:** Case-sensitive

### Password Validation:
- **Length:** 8-16 characters
- **First Character:** Must start with a capital letter
- **Special Characters:** Must contain at least one special character
- **Allowed Special Chars:** `!@#$%^&*()_+-=[]{};"\\|,.<>/?`

### Email Validation:
- **Format:** Valid email format (RFC 5322)
- **Uniqueness:** Must be unique across all users
- **Case:** Case-insensitive

### Full Name Validation:
- **Length:** 2-50 characters
- **Characters:** Letters, spaces, hyphens, apostrophes only
- **Required:** Cannot be empty

---

## ❌ Error Handling

### HTTP Status Codes:
- **200** - Success
- **201** - Created (for signup)
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid credentials)
- **404** - Not Found (email not found for reset)
- **409** - Conflict (duplicate userId/email)
- **500** - Internal Server Error

### Error Response Format:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "ERROR_CODE",
  "errors": {
    "field": "specific field error message"
  }
}
```

### Common Error Codes:
- `INVALID_CREDENTIALS` - Wrong login details
- `INVALID_ADMIN_CREDENTIALS` - Wrong admin login details
- `VALIDATION_ERROR` - Form validation failed
- `USER_EXISTS` - User ID or email already exists
- `EMAIL_NOT_FOUND` - Email not registered
- `ACCOUNT_INACTIVE` - Account is disabled

---

## 🔒 Security Requirements

### Password Security:
- **Hashing:** Use bcrypt or similar (min 12 rounds)
- **Storage:** Never store plain text passwords
- **Transmission:** Always use HTTPS

### Authentication:
- **JWT Tokens:** Recommended for session management
- **Token Expiry:** 1 hour for regular users, configurable for admins
- **Refresh Tokens:** Implement for better UX (optional)

### Rate Limiting:
- **Login Attempts:** Max 5 attempts per IP per 15 minutes
- **Password Reset:** Max 3 requests per email per hour
- **Registration:** Max 5 registrations per IP per day

### Data Protection:
- **SQL Injection:** Use parameterized queries
- **CORS:** Configure properly for frontend domain
- **Headers:** Set security headers (CSRF, XSS protection)

---

## 🧪 Testing Guidelines

### Test Cases to Implement:

#### User Login Tests:
```javascript
// Valid login
POST /api/login
{
  "userId": "testuser123",
  "password": "Password123!",
  "loginType": "user"
}
// Expected: 200 with user data and token

// Invalid credentials
POST /api/login
{
  "userId": "wronguser",
  "password": "wrongpass",
  "loginType": "user"
}
// Expected: 401 with error message
```

#### Admin Login Tests:
```javascript
// Valid admin login
POST /api/admin-login
{
  "userId": "admin001",
  "password": "AdminPass123!",
  "loginType": "admin"
}
// Expected: 200 with admin data and token
```

#### User Registration Tests:
```javascript
// Valid registration
POST /api/signup
{
  "fullName": "Test User",
  "email": "test@example.com",
  "userId": "testuser123",
  "password": "Password123!"
}
// Expected: 201 with user created message

// Duplicate userId
POST /api/signup
{
  "fullName": "Another User",
  "email": "new@example.com",
  "userId": "testuser123",
  "password": "Password123!"
}
// Expected: 409 with duplicate error
```

#### Password Reset Tests:
```javascript
// Valid email
POST /api/forgot-password
{
  "email": "test@example.com"
}
// Expected: 200 with reset email sent message

// Invalid email
POST /api/forgot-password
{
  "email": "notfound@example.com"
}
// Expected: 404 with email not found error
```

---

## 📝 Frontend Integration Notes

### Current Frontend Behavior:
1. **Login Form:** Toggles between User/Admin mode
2. **Validation:** Client-side validation matches server requirements
3. **Error Display:** Shows validation errors inline
4. **Success Handling:** Redirects after successful operations
5. **Password Visibility:** Toggle button for password fields

### Expected Frontend Changes After API Integration:
1. Replace `console.log` statements with actual API calls
2. Handle JWT tokens for authenticated requests
3. Implement proper error message display
4. Add loading states during API calls
5. Redirect users to dashboard after successful login

---

## 🌐 CORS Configuration

Allow requests from:
- `http://localhost:4200` (Angular dev server)
- Your production domain

Required headers:
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (for authenticated routes)

---

## 📞 Support & Questions

For any clarifications on these API requirements, please contact the frontend development team. This document covers all the current UI functionality and expected API behavior.

### Frontend Tech Stack:
- **Framework:** Angular 20+
- **Language:** TypeScript
- **HTTP Client:** Native Fetch API
- **Forms:** Angular Forms with ngModel
- **Styling:** Plain CSS (no frameworks)

---

**Last Updated:** July 28, 2025  
**Version:** 1.0  
**Status:** Ready for Backend Implementation
