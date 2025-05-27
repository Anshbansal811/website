# Backend Project

## Overview
This project is a backend application that connects to both MongoDB and PostgreSQL databases. It uses Mongoose for MongoDB interactions and Prisma as an ORM for PostgreSQL.

## Project Structure
```
backend-project
├── src
│   ├── config
│   │   ├── mongodb.ts
│   │   └── postgresql.ts
│   ├── prisma
│   │   ├── schema.prisma
│   │   ├── migrations
│   │   └── seed.ts
│   ├── models
│   │   ├── mongoSchema.ts
│   │   └── index.ts
│   └── app.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd backend-project
   ```

2. **Install Dependencies**
   Run the following command to install the necessary packages:
   ```bash
   npm install express mongoose prisma @prisma/client dotenv
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add your MongoDB and PostgreSQL connection strings:
   ```properties
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>

   # PostgreSQL Connection (Prisma)
   DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"
   ```

4. **Initialize Prisma**
   Run the following command to initialize Prisma:
   ```bash
   npx prisma init
   ```

5. **Create Your Prisma Schema**
   Define your database schema in `src/prisma/schema.prisma`.

6. **Generate Migrations**
   After defining your schema, run the following command to create migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

7. **Seed the Database**
   If you have seed data, run the following command to populate your PostgreSQL database:
   ```bash
   npx prisma db seed
   ```

8. **Connect to Databases**
   - Use Mongoose to connect to MongoDB in `src/config/mongodb.ts`.
   - Use Prisma to connect to PostgreSQL in `src/config/postgresql.ts`.

## Usage
To start the application, run:
```bash
npm start
```

This will launch the server, and you can begin interacting with your APIs.

## Additional Notes
- Ensure that your MongoDB and PostgreSQL databases are accessible and that the connection strings in the `.env` file are correct.
- You can modify the Prisma schema and run migrations as needed to update your database structure.