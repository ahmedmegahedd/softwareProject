# Ehgez Hafla – Backend API Documentation

## Overview
This document describes the REST API endpoints for the Ehgez Hafla Online Event Ticketing System backend. All endpoints are prefixed with `/api/v1`.

---

## Authentication

### Register
- **POST** `/api/v1/register`
- **Access:** Public
- **Body:**
  ```json
  { "name": "string", "email": "string", "password": "string", "role": "user|organizer|admin" }
  ```
- **Response:**
  ```json
  { "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }
  ```

### Login
- **POST** `/api/v1/login`
- **Access:** Public
- **Body:**
  ```json
  { "email": "string", "password": "string" }
  ```
- **Response:**
  ```json
  { "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }
  ```

### Logout
- **POST** `/api/v1/logout`
- **Access:** Authenticated users
- **Response:**
  ```json
  { "success": true, "message": "Logged out successfully" }
  ```

### Forgot Password (Send OTP)
- **PUT** `/api/v1/forgetPassword`
- **Access:** Public
- **Body:**
  ```json
  { "email": "string" }
  ```
- **Response:**
  ```json
  { "success": true, "message": "OTP sent to email" }
  ```

### Reset Password (Verify OTP)
- **PUT** `/api/v1/resetPassword`
- **Access:** Public
- **Body:**
  ```json
  { "email": "string", "otp": "string", "newPassword": "string" }
  ```
- **Response:**
  ```json
  { "success": true, "message": "Password reset successful" }
  ```

---

## Users

### Get All Users
- **GET** `/api/v1/users`
- **Access:** Admin
- **Response:**
  ```json
  { "success": true, "data": [ { "id": "...", "name": "...", "email": "...", "role": "..." }, ... ] }
  ```

### Get User Profile
- **GET** `/api/v1/users/profile`
- **Access:** Authenticated users
- **Response:**
  ```json
  { "success": true, "data": { "id": "...", "name": "...", "email": "...", "role": "..." } }
  ```

### Update User Profile
- **PUT** `/api/v1/users/profile`
- **Access:** Authenticated users
- **Body:**
  ```json
  { "name": "string", "email": "string" }
  ```
- **Response:**
  ```json
  { "success": true, "data": { "id": "...", "name": "...", "email": "...", "role": "..." } }
  ```

### Get Single User (Admin)
- **GET** `/api/v1/users/:id`
- **Access:** Admin
- **Response:**
  ```json
  { "success": true, "data": { "id": "...", "name": "...", "email": "...", "role": "..." } }
  ```

### Update User Role (Admin)
- **PATCH** `/api/v1/users/:id`
- **Access:** Admin
- **Body:**
  ```json
  { "role": "user|organizer|admin" }
  ```
- **Response:**
  ```json
  { "success": true, "data": { "id": "...", "name": "...", "email": "...", "role": "..." } }
  ```

### Delete User (Admin)
- **DELETE** `/api/v1/users/:id`
- **Access:** Admin
- **Response:**
  ```json
  { "success": true, "data": {} }
  ```

### Get Current User's Bookings
- **GET** `/api/v1/users/bookings`
- **Access:** Standard User
- **Response:**
  ```json
  { "success": true, "data": [ ... ] }
  ```

### Get Organizer's Events
- **GET** `/api/v1/users/events`
- **Access:** Organizer
- **Response:**
  ```json
  { "success": true, "data": [ ... ] }
  ```

### Get Organizer's Analytics
- **GET** `/api/v1/users/events/analytics`
- **Access:** Organizer
- **Response:**
  ```json
  { "success": true, "data": [ ... ] }
  ```

---

## Events

### List Approved Events
- **GET** `/api/v1/events`
- **Access:** Public
- **Response:**
  ```json
  { "success": true, "data": [ ... ] }
  ```

### List All Events (Admin/Organizer)
- **GET** `/api/v1/events/all`
- **Access:** Admin, Organizer
- **Response:**
  ```json
  { "success": true, "data": [ ... ] }
  ```

### Get Single Event
- **GET** `/api/v1/events/:id`
- **Access:** Admin, Organizer, or event's organizer
- **Response:**
  ```json
  { "success": true, "data": { ... } }
  ```

### Create Event
- **POST** `/api/v1/events`
- **Access:** Organizer
- **Body:**
  ```json
  { "title": "string", "description": "string", "date": "YYYY-MM-DD", "location": "string", "price": number, "ticketsAvailable": number, "image": "string (optional)" }
  ```
- **Response:**
  ```json
  { "success": true, "data": { ... } }
  ```

### Update Event
- **PUT** `/api/v1/events/:id`
- **Access:** Organizer, Admin
- **Body:**
  ```json
  { ...fields to update... }
  ```
- **Response:**
  ```json
  { "success": true, "data": { ... } }
  ```

### Update Event Status (Admin)
- **PATCH** `/api/v1/events/:id`
- **Access:** Admin
- **Body:**
  ```json
  { "status": "approved|pending|declined" }
  ```
- **Response:**
  ```json
  { "success": true, "data": { ... } }
  ```

### Delete Event
- **DELETE** `/api/v1/events/:id`
- **Access:** Organizer, Admin
- **Response:**
  ```json
  { "success": true, "data": {} }
  ```

### Get Event Analytics
- **GET** `/api/v1/events/analytics`
- **Access:** Admin, Organizer
- **Response:**
  ```json
  { "success": true, "data": [ ... ] }
  ```

---

## Bookings

### Book Tickets (RESTful)
- **POST** `/api/v1/events/:eventId/bookings`
- **Access:** Standard User
- **Body:**
  ```json
  { "tickets": number }
  ```
- **Response:**
  ```json
  { "success": true, "data": { ... } }
  ```

### Book Tickets (Legacy)
- **POST** `/api/v1/bookings`
- **Access:** Standard User
- **Body:**
  ```json
  { "eventId": "string", "tickets": number }
  ```
- **Response:**
  ```json
  { "success": true, "data": { ... } }
  ```

### List Current User's Bookings
- **GET** `/api/v1/bookings`
- **Access:** Standard User
- **Response:**
  ```json
  { "success": true, "data": [ ... ] }
  ```

### Get Booking by ID
- **GET** `/api/v1/bookings/:id`
- **Access:** Standard User
- **Response:**
  ```json
  { "success": true, "data": { ... } }
  ```

### Cancel Booking
- **DELETE** `/api/v1/bookings/:id`
- **Access:** Standard User
- **Response:**
  ```json
  { "success": true, "data": { ... } }
  ```

---

## Error Response Format
All error responses use:
```json
{ "success": false, "error": "...error message..." }
```

---

## Authentication
- Most endpoints require a valid JWT token in an HttpOnly cookie named `token`.
- Role-based access is enforced for all protected endpoints.

---

## Contact
For questions, contact the development team. 