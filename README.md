# Linktree Backend with Referral System

A secure and scalable backend implementation for a Linktree-like platform with user authentication and referral system.

## Features

- User registration and authentication
- JWT-based authentication
- Password reset functionality
- Referral system with unique referral codes
- Referral tracking and statistics
- Rate limiting and security measures
- PostgreSQL database with optimized schema

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd linktree-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a PostgreSQL database:
```bash
createdb linktree_db
```

4. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your configuration

5. Initialize the database schema:
```bash
psql -d linktree_db -f src/config/schema.sql
```

6. Build the TypeScript code:
```bash
npm run build
```

7. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ email, username, password, referralCode? }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`

- `POST /api/auth/forgot-password` - Request password reset
  - Body: `{ email }`

### Referrals

- `GET /api/referrals/stats` - Get referral statistics
  - Requires authentication

- `GET /api/referrals/referred-users` - Get list of referred users
  - Requires authentication

- `GET /api/referrals/code` - Get user's referral code and link
  - Requires authentication

## Security Features

- Password hashing using bcrypt
- JWT token authentication
- Rate limiting on authentication endpoints
- SQL injection protection
- XSS protection
- CSRF protection
- Secure password reset flow

## Development

1. Start in development mode:
```bash
npm run dev
```

2. Run tests:
```bash
npm test
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_USER` - Database user
- `DB_HOST` - Database host
- `DB_NAME` - Database name
- `DB_PASSWORD` - Database password
- `DB_PORT` - Database port
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time
- `FRONTEND_URL` - Frontend application URL

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 