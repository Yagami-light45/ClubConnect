# Club Recruitment Management System - MVP Todo

## Core Files to Create/Modify:

### 1. Authentication & Context
- `src/contexts/AuthContext.jsx` - Authentication context with role management
- `src/components/auth/LoginForm.jsx` - Login component
- `src/components/auth/ProtectedRoute.jsx` - Route protection based on roles

### 2. Admin Features
- `src/components/admin/AdminDashboard.jsx` - Admin dashboard
- `src/components/admin/ClubManagement.jsx` - Approve clubs, assign heads

### 3. Club Head Features  
- `src/components/clubhead/ClubHeadDashboard.jsx` - Club head dashboard
- `src/components/clubhead/RecruitmentDrive.jsx` - Create drives, set questions
- `src/components/clubhead/ApplicantsList.jsx` - View/filter/manage applicants

### 4. Student Features
- `src/components/student/StudentDashboard.jsx` - Browse clubs, view applications
- `src/components/student/ClubApplication.jsx` - Application form with custom questions
- `src/components/student/ApplicationStatus.jsx` - Track application status

### 5. Shared Components
- `src/components/shared/Navbar.jsx` - Navigation with role-based menu
- `src/components/shared/NotificationCenter.jsx` - In-app notifications

### 6. Data & Utils
- `src/data/mockData.js` - Mock data for clubs, users, applications
- `src/utils/constants.js` - Role constants and status enums

### 7. Main App Updates
- `src/App.jsx` - Update with routing and authentication
- `index.html` - Update title

## Implementation Strategy:
1. Simple role-based authentication (mock users)
2. Local state management (no backend required for MVP)
3. Mock data for demonstration
4. Responsive design with Tailwind CSS
5. In-app notifications (no email for MVP)

## Roles:
- ADMIN: Manage clubs and assign heads
- CLUB_HEAD: Manage recruitment drives and applicants  
- STUDENT: Apply to clubs and track status