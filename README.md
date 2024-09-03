Certainly! Here's a more detailed README that includes all the features of your Real Estate API project, including ordering properties, forgot password, reset password, and listing of land.

---

# Real Estate API

## Overview

The Real Estate API is a robust backend service designed to manage a real estate platform. The API allows users to browse properties, list lands, post reviews, order properties, and interact with blog content. It includes features like user authentication, email verification, forgot password, reset password, activity logging, CORS management, and more. This README provides a detailed explanation of the project's setup, features, and usage.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Properties](#properties)
  - [Land Listings](#land-listings)
  - [Orders](#orders)
  - [Reviews](#reviews)
  - [Blogs](#blogs)
  - [Comments](#comments)
  - [Activity Logging](#activity-logging)
- [Middleware](#middleware)
  - [Email Verification](#email-verification)
  - [Forgot Password & Reset Password](#forgot-password--reset-password)
  - [CORS](#cors)
  - [Cookie-Parser](#cookie-parser)
- [Usage](#usage)
  - [User Registration and Email Verification](#user-registration-and-email-verification)
  - [Property Management](#property-management)
  - [Blog and Comments](#blog-and-comments)
  - [Ordering Properties](#ordering-properties)
  - [Forgot Password and Reset Password](#forgot-password-and-reset-password)
  - [Activity Logs](#activity-logs)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **User Authentication**: Secure user login and registration using JWT tokens.
- **Email Verification**: Users must verify their email addresses before accessing certain features.
- **Forgot Password & Reset Password**: Allows users to reset their password if they forget it.
- **Property Management**: Create, update, delete, and browse property listings.
- **Land Listings**: Create and manage listings specifically for land.
- **Property Orders**: Users can place orders to purchase or rent properties.
- **Review System**: Users can post and manage reviews on properties.
- **Blog Management**: Admins can publish blog posts on various topics, and users can comment on these posts.
- **Comment System**: Users can comment on blog posts, and admins can manage these comments.
- **Activity Logging**: Logs user activities such as posting reviews, ordering properties, and interacting with blogs.
- **CORS Implementation**: Ensures secure cross-origin communication between the frontend and backend.
- **Cookie Management**: JWT tokens are stored in cookies, with easy access through the `cookie-parser` middleware.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/real-estate-api.git
    cd real-estate-api
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and include the following:

## Environment Variables

```env
PORT=5000
MONGO_URI=your_mongo_database_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_HOST=smtp.your_email_provider.com
EMAIL_PORT=587
EMAIL_FROM=no-reply@yourdomain.com
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_secret
CORS_ORIGIN=your_frontend_domain
```

4. **Run the application**:
    ```bash
    npm start
    ```

## Endpoints

### Auth

- `POST /api/v1/auth/signup`: Register a new user.
- `POST /api/v1/auth/login`: Log in a user.
- `POST /api/v1/auth/verify-email`: Verify a user's email address after registration.
- `POST /api/v1/auth/forgot-password`: Trigger a password reset process by sending a reset link to the user's email.
- `PATCH /api/v1/auth/reset-password/:token`: Reset the password using the token sent to the user's email.

### Properties

- `GET /api/v1/properties`: Retrieve all properties.
- `POST /api/v1/properties`: Create a new property listing (Admin only).
- `PATCH /api/v1/properties/:id`: Update a property listing (Admin only).
- `DELETE /api/v1/properties/:id`: Delete a property listing (Admin only).

### Land Listings

- `GET /api/v1/land-listings`: Retrieve all land listings.
- `POST /api/v1/land-listings`: Create a new land listing (Admin only).
- `PATCH /api/v1/land-listings/:id`: Update a land listing (Admin only).
- `DELETE /api/v1/land-listings/:id`: Delete a land listing (Admin only).

### Orders

- `POST /api/v1/orders`: Place an order for a property (User only).
- `GET /api/v1/orders`: Retrieve all orders for the authenticated user.
- `GET /api/v1/orders/:id`: Retrieve a specific order by ID.

### Reviews

- `POST /api/v1/reviews`: Add a review to a property.
- `GET /api/v1/reviews/:propertyId`: Get all reviews for a specific property.
- `DELETE /api/v1/reviews/:id`: Delete a review.

### Blogs

- `GET /api/v1/blogs`: Retrieve all blog posts.
- `POST /api/v1/blogs`: Create a new blog post (Admin only).
- `PATCH /api/v1/blogs/:id`: Update a blog post (Admin only).
- `DELETE /api/v1/blogs/:id`: Delete a blog post (Admin only).

### Comments

- `POST /api/v1/comments`: Add a comment to a blog post.
- `GET /api/v1/comments/:blogId`: Retrieve all comments for a specific blog post.
- `DELETE /api/v1/comments/:id`: Delete a comment.

### Activity Logging

- **Logs**: Automatically logs activities like property orders, posting reviews, and adding comments to blogs. Activities can be monitored by admins for better insights into user engagement.

## Middleware

### Email Verification

- **Purpose**: Ensures that users verify their email addresses before accessing features like ordering properties or posting reviews.
- **Implementation**: After registration, an email is sent to the user with a verification link. The link directs them to the `/api/v1/auth/verify-email` endpoint, where their email is verified.

### Forgot Password & Reset Password

- **Forgot Password**: Users can initiate a password reset process by sending a request to `/api/v1/auth/forgot-password` with their email address. A reset link is sent to their email.
- **Reset Password**: Users can reset their password by visiting the link provided in the reset email, which directs them to `/api/v1/auth/reset-password/:token`.

### CORS

- **Purpose**: Cross-Origin Resource Sharing (CORS) allows the backend to specify which domains are permitted to access resources. This prevents unauthorized domains from making requests to the API.
- **Configuration**: The CORS settings are configured to allow requests only from the specified frontend domain.

### Cookie-Parser

- **Purpose**: Simplifies access to cookies sent along with HTTP requests. Particularly useful for managing JWT tokens stored in cookies.
- **Implementation**: Installed and configured in the backend to parse cookies and make them available as JavaScript objects in `req.cookies`.

## Usage

### User Registration and Email Verification

- Users can register using the `/api/v1/auth/signup` endpoint. After registration, they will receive an email with a verification link.
- Users must verify their email before they can access certain features, such as ordering properties or posting reviews.

### Property Management

- Admins can create, update, or delete property listings using the respective endpoints.
- Users can browse all available properties via the `/api/v1/properties` endpoint.

### Blog and Comments

- Admins can publish blog posts on real estate-related topics, which users can comment on.
- The `/api/v1/comments` endpoint allows users to add comments to blog posts, and admins can manage these comments.

### Ordering Properties

- Users can place orders for properties they are interested in through the `/api/v1/orders` endpoint.
- Order details are automatically logged, allowing both users and admins to track the status of orders.

### Forgot Password and Reset Password

- Users who forget their passwords can trigger a reset by sending a request to `/api/v1/auth/forgot-password`.
- After receiving the reset link via email, users can reset their passwords using the `/api/v1/auth/reset-password/:token` endpoint.

### Activity Logs

- Every action a user takes, such as posting a review, placing an order, or commenting on a blog post, is logged.
- Admins can access these logs to monitor user engagement and activity on the platform.

## Contributing

Contributions are welcome! Please follow these steps if you have suggestions for improving the API:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push the branch (`