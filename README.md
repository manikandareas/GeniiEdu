# Genii Edu

**Genii Edu** is an innovative platform designed to streamline the creation of effective learning experiences for teachers. It allows educators to set up virtual classrooms, share diverse learning materials, assign tasks, and monitor student progress. The platform’s collaborative and personalized feedback features make learning more interactive and student-centered.

## Features

### General

- **User Authentication**
  - Sign up and log in using GitHub, Google, or email
- **Theme**
  - Switch between Dark and Light themes

### Teacher

- **Class Management**
  - Create and manage classes
  - Add and organize learning materials
  - Assign tasks and assignments
    - Comment on student submissions
    - Grade student submissions
  - Post announcements

- **Profile Management**
  - Update user profile

- **Notifications**
  - Receive real-time updates

### Student

- **Class Participation**
  - Join classes using invitation codes
  - Access learning materials
  - View announcements
  - Submit assignments
    - Comment on teacher feedback
  - Track upcoming tasks and deadlines

- **Profile Management**
  - Update user profile

- **Notifications**
  - Stay updated with real-time notifications

## Tech Stack

**Client:**
- Next.js 14
- Tailwind CSS
- ShadCN
- TanStack Query
- Zod
- Zustand

**Server:**
- Next.js 14 Server Actions
- next-safe-action
- Pusher
- uploadthing
- resend
- Golang (for notification system in a separate repository)

## Roadmap

- **Dashboard Enhancements:** Expand the current static view into a fully functional dashboard.
- **Backend Separation:** Migrate all backend services to Golang for improved scalability and performance.

## Environment Variables

To run this project, ensure you have the following environment variables set in your `.env` file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_ROOT_PAGE=/dashboard
JWT_SECRET=
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=genii_edu
DATABASE_USER=
DATABASE_PASSWORD=
RESEND_API_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
PUSHER_APP_ID=
NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_CLUSTER=
```
