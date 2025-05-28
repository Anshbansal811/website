# Contact Form Backend

This is the backend service for the contact form, built with Node.js, Express, TypeScript, and PostgreSQL (Supabase).

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- PostgreSQL database (Supabase in this case)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts         # Database configuration
│   ├── controllers/
│   │   └── contact.controller.ts  # Contact form controller
│   ├── db/
│   │   ├── migrate.ts    # Database migration script
│   │   └── schema.sql    # Database schema
│   ├── models/
│   │   └── contact.model.ts  # Contact form model
│   ├── routes/
│   │   └── contact.routes.ts # API routes
│   └── server.ts         # Main server file
├── .env                  # Environment variables
├── package.json
└── tsconfig.json
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Environment Setup

Create a `.env` file in the backend directory with the following content:

```
PORT=5000
DATABASE_URL="postgresql://postgres:Anshban@db.gvyzd.supabase.co:5432/postgres"
```
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
 ------

 config-db.ts

 import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
----------

Let's create the database schema for the contact form:

---------------------------------

Now, let's create the contact form model:

--------------------------------------------

Let's create the contact form controller:

----------------------------------------

Now, let's create the routes:

-----------------------------------

Finally, let's create the main server file:

---------------------------------------

check cd backend
npm install
npm run dev

### 4. Database Migration

Run the database migration to create the necessary table:

```bash
npm run migrate
```

### 5. Start the Development Server

```bash
npm run dev
```

The server will start on http://localhost:5000

## API Endpoints

### Contact Form Submission

- **URL**: `/api/contact/submit`
- **Method**: `POST`
- **Body**:

```json
{
  "name": "string",
  "phonenumber": "string",
  "subject": "string",
  "message": "string",
  "state": "string",
  "city": "string",
  "company": "string",
  "gst_pan": "string (optional)"
}
```

### Health Check

- **URL**: `/health`
- **Method**: `GET`
- **Response**: `{ "status": "ok" }`

## Available Scripts

- `npm run dev`: Start development server with hot-reload
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server
- `npm run migrate`: Run database migrations

## Database Schema

The contact form submissions are stored in the `contact_submissions` table with the following structure:

```sql
CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phonenumber VARCHAR(20) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    company VARCHAR(255) NOT NULL,
    gst_pan VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

1. **Database Connection Issues**

   - Verify your DATABASE_URL in the .env file
   - Check if your Supabase database is running
   - Ensure your IP is whitelisted in Supabase

2. **Migration Errors**

   - Make sure you have the correct permissions in your database
   - Check if the table already exists
   - Verify the schema.sql file is properly formatted

3. **Server Not Starting**
   - Check if port 5000 is available
   - Verify all dependencies are installed
   - Check the console for error messages

## Frontend Integration

The frontend is already configured to connect to this backend. The contact form will send POST requests to:

```
http://localhost:5000/api/contact/submit
```

## Security Considerations

1. The backend uses CORS to allow requests from your frontend
2. SSL is enabled for database connections
3. Environment variables are used for sensitive data

## Development

To make changes to the codebase:

1. Make your changes in the TypeScript files
2. The development server will automatically reload
3. For production, run `npm run build` before deploying

## Deployment

For production deployment:

1. Build the TypeScript code:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

Remember to update the frontend API URL to point to your production backend URL when deploying.
