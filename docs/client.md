## User Pages and Services

### 1. **Authentication**

- **Login Page**
  - Form to input email and password.
  - "Forgot Password" link for password recovery.
  - "Register" link for new users.
- **Register Page**
  - Form for new user registration.
  - Fields: username, email, password, confirm password.
  - Role selection: teacher or student.
- **Password Recovery Page**
  - Form to recover or reset the password.
  - Input for email address to send reset link.

### 2. **User Profile**

- **Profile Page**
  - View and edit user profile details.
  - Fields: profile picture, username, email, bio, etc.
- **Edit Profile Page**
  - Form to update profile details and upload profile picture.

## Class Pages and Services

### 3. **Class Dashboard**

- **Classes Overview Page**

  - List of classes the user is enrolled in (as teacher or student).
  - Options to view class details, join new classes, or create a class (for teachers).

- **Class Detail Page**
  - Display class information: class name, description, schedule, etc.
  - Tabs/sections for announcements, assignments, materials, and members.

### 4. **Class Management**

- **Create/Edit Class Page**

  - Form for teachers to create or edit class details.
  - Fields: class name, description, schedule (start and end dates).

- **Class Members Page**
  - List of class members.
  - Role and status management (teachers can promote/demote students).

### 5. **Class Enrollment**

- **Join Class Page**
  - Form to join a class using a class code or invitation link.

## Assignment Pages and Services

### 6. **Assignments Overview**

- **Assignments List Page**

  - List of assignments for a class.
  - Filter by upcoming, due, or submitted assignments.

- **Assignment Detail Page**
  - View assignment details: title, description, due date, attached files.
  - Submission status and grade (if available).

### 7. **Assignment Submission**

- **Submit Assignment Page**

  - Form to upload and submit assignment files.
  - View past submissions and statuses.

- **Assignment Grading Page** (Teachers only)
  - Form to grade assignments and provide feedback.

## Learning Material Pages and Services

### 8. **Learning Materials**

- **Learning Materials List Page**

  - List of learning materials available for a class.
  - Options to download files or view details.

- **Material Detail Page**
  - View detailed information about a learning material.
  - Download or preview material files.

### 9. **Folder Management**

- **Folders Overview Page**

  - List of folders for organizing learning materials.
  - Folder hierarchy visualization.

- **Folder Detail Page**
  - View materials within a specific folder.
  - Manage folder structure (create, rename, delete).

## Notification Pages and Services

### 10. **Notifications**

- **Notifications Page**
  - List of notifications for the user.
  - Mark notifications as read or delete them.

## Announcement Pages and Services

### 11. **Announcements**

- **Announcements List Page**

  - List of announcements for a class.
  - Filter by date or category.

- **Create/Edit Announcement Page** (Teachers only)
  - Form to create or edit announcements.
  - Fields: title, content.

## Miscellaneous Pages and Services

### 12. **Search**

- **Search Page**
  - Universal search for classes, users, assignments, and materials.
  - Filters to refine search results.

### 13. **Dashboard/Home**

- **Dashboard Page**
  - Personalized home page with an overview of recent activities.
  - Sections for upcoming assignments, recent announcements, etc.

## Example Client Page/Service Mapping

### Authentication

- **Login Page:** `/login`
- **Register Page:** `/register`
- **Password Recovery Page:** `/forgot-password`

### User Profile

- **Profile Page:** `/profile`
- **Edit Profile Page:** `/profile/edit`

### Class Management

- **Classes Overview Page:** `/classes`
- **Class Detail Page:** `/classes/{class_id}`
- **Create/Edit Class Page:** `/classes/create` or `/classes/{class_id}/edit`
- **Class Members Page:** `/classes/{class_id}/members`

### Assignments

- **Assignments List Page:** `/classes/{class_id}/assignments`
- **Assignment Detail Page:** `/assignments/{assignment_id}`
- **Submit Assignment Page:** `/assignments/{assignment_id}/submit`
- **Assignment Grading Page:** `/assignments/{assignment_id}/grade`

### Learning Materials

- **Learning Materials List Page:** `/classes/{class_id}/materials`
- **Material Detail Page:** `/materials/{material_id}`
- **Folders Overview Page:** `/classes/{class_id}/folders`
- **Folder Detail Page:** `/folders/{folder_id}`

### Notifications

- **Notifications Page:** `/notifications`

### Announcements

- **Announcements List Page:** `/classes/{class_id}/announcements`
- **Create/Edit Announcement Page:** `/classes/{class_id}/announcements/create`

### Search

- **Search Page:** `/search`

### Dashboard/Home

- **Dashboard Page:** `/dashboard`
