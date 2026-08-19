# OB-GYNE Clinic Management System

OB-GYNE is a full-stack clinic management application for obstetrics and gynecology practices. It gives authorized staff one place to manage patients and their medical records, schedule checkups, record diagnoses and vital signs, track deliveries, and maintain medicine inventory and purchases.

The application has a React/Next.js frontend and an Express API backed by PostgreSQL. Authentication uses JSON Web Tokens, and patient-related workflows are organized under the dashboard, patient management, and inventory areas.

## Requirements

- Node.js `24.x` (the project checks this before build and start)
- npm
- PostgreSQL `12+` with permission to create the application schema
- A database created for this application
- Optional: Google Drive service-account credentials for document-related features

Check the installed Node.js version before installing dependencies:

```bash
node --version
```

It must report version `24.x`.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Create a `.env` file in the project root. The API reads this file automatically when it starts.

```dotenv
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_NAME=obgyne
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_SSL_REJECT_UNAUTHORIZED=false
```

For Google Drive integration, also provide:

```dotenv
GOOGLE_DRIVE_CLIENT_EMAIL=your-service-account-email
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Do not commit `.env` or real credentials. Use a secret manager or deployment environment variables outside local development.

### 3. Initialize PostgreSQL

Create the database named in `DB_NAME`, then run the schema script:

```bash
createdb obgyne
psql -h localhost -U postgres -d obgyne -f src/server/sql/db_schema.sql
```

If your PostgreSQL connection uses different values, update the command and `.env` accordingly.

### 4. Start development

```bash
npm run dev
```

Next.js starts the application in development mode. Open [http://localhost:3000](http://localhost:3000). API requests are available under `/api`; the Express API listens on port `8080` by default.

## Production

Build the application and start the production server with:

```bash
npm run build
npm start
```

The production server uses the `PORT` environment variable when provided. Ensure the production environment has the same database variables and a PostgreSQL instance reachable by the application.

## Main Features

- User login and password management
- Dashboard for clinic activity and scheduled checkups
- Patient search, registration, and patient records
- Diagnoses, medical history, vital signs, delivery history, and patient medicines
- Medicine inventory and purchase tracking
- PostgreSQL persistence through the server-side data-access and service layers

## Project Structure

```text
pages/                 Next.js pages and API catch-all entry point
public/                Public assets
src/client/            React UI, routes, Redux store, actions, and styles
src/server/            Express API, routes, services, DAOs, and database access
src/server/sql/        PostgreSQL schema
scripts/               Project validation scripts
```

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |

## API Areas

The Express API is mounted under these route groups:

- `/api/auth`
- `/api/admin/user`
- `/api/admin/patient`
- `/api/admin/medicine`
- `/api/admin/patient-diagnosis`
- `/api/admin/patient-medicine`
- `/api/admin/patient-delivery`
- `/api/admin/patient-vitalsigns`

See [src/server/api-doc.yaml](src/server/api-doc.yaml) for the API reference.
