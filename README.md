# AIResumePro
## Project Structure

```
app/
├── api/
│   ├── auth/
│   │   └── signup/
│   │       └── route.ts
│   ├── users/
│   │   ├── profile/
│   │   │   └── route.ts
│   │   └── roles/
│   │       └── route.ts
│   ├── resumes/
│   │   ├── route.ts                    # List resumes
│   │   ├── upload/
│   │   │   └── route.ts                # Upload resume
│   │   └── [id]/
│   │       ├── route.ts                # Get/Update/Delete resume
│   │       ├── download/
│   │       │   └── route.ts            # Download resume
│   │       └── parse/
│   │           └── route.ts            # Parse resume
│   ├── jobs/
│   │   ├── route.ts                    # List/Create jobs
│   │   ├── [id]/
│   │   │   └── route.ts                # Get/Update/Delete job
│   │   └── recruiter/
│   │       └── my-jobs/
│   │           └── route.ts            # Get recruiter's jobs
│   ├── applications/
│   │   ├── route.ts                    # Apply to job
│   │   ├── my-applications/
│   │   │   └── route.ts                # Get user's applications
│   │   ├── [id]/
│   │   │   ├── route.ts                # Get application details
│   │   │   └── status/
│   │   │       └── route.ts            # Update application status
│   │   └── job/
│   │       └── [jobId]/
│   │           └── route.ts            # Get applications for job
│   ├── fit-score/
│   │   ├── calculate/
│   │   │   └── route.ts                # Calculate fit score
│   │   └── history/
│   │       └── route.ts                # Get fit score history
│   └── admin/
│       ├── users/
│       │   ├── route.ts                # List users
│       │   └── [id]/
│       │       ├── block/
│       │       │   └── route.ts        # Block/unblock user
│       │       └── route.ts            # Delete user
│       ├── jobs/
│       │   ├── route.ts                # List all jobs
│       │   └── [id]/
│       │       └── route.ts            # Delete job
│       ├── resumes/
│       │   ├── route.ts                # List all resumes
│       │   └── [id]/
│       │       └── route.ts            # Delete resume
│       └── stats/
│           └── route.ts                # Dashboard stats
│
├── (auth)/
│   └── signin/
│       └── page.tsx
│
lib/
├── auth.ts                             # NextAuth configuration
├── db.ts                               # MongoDB connection
├── resumeParser.ts                     # Resume parsing logic
└── fitScoreCalculator.ts               # Fit score calculation logic

models/
├── User.ts
├── Resume.ts
├── Job.ts
├── Application.ts
└── FitScore.ts

middleware.ts                           # Route protection middleware
```

A comprehensive Resume-Job Matching platform with AI-powered fit scoring.

## 📦 Package Contents

This package contains:

1. **API Documentation** (`API_DOCUMENTATION.md`)
   - Complete API reference with all endpoints
   - Request/response examples
   - Authentication & authorization details
   - Error handling guidelines

2. **Implementation Guide** (`IMPLEMENTATION_GUIDE.md`)
   - Step-by-step setup instructions
   - Project structure
   - Database configuration
   - Testing guidelines
   - Deployment instructions

3. **API Route Implementations** (`api-routes/`)
   - All Next.js 14+ API routes
   - Authentication (signup, signin with NextAuth)
   - Resume management (upload, parse, CRUD)
   - Job management (CRUD)
   - Application system
   - Fit score calculation
   - Admin panel APIs

4. **Utility Libraries** (`api-routes/utils/`)
   - Resume parser (PDF & DOCX support)
   - Fit score calculator (weighted algorithm)
   - Database connection helper
   - NextAuth configuration

5. **Type Definitions** (`types/`)
   - TypeScript interfaces for all API responses
   - NextAuth type extensions

6. **Configuration Files**
   - `package.json` with all dependencies
   - `.env.example` with required environment variables
   - `middleware.ts` for route protection

## 🚀 Quick Start

### 1. Copy Files to Your Next.js Project

```bash
# Copy API routes
cp -r api-routes/* your-project/app/api/

# Copy utilities
cp -r api-routes/utils/* your-project/lib/
cp -r api-routes/fit-score/fitScoreCalculator.ts your-project/lib/
cp -r api-routes/fit-score/resumeParser.ts your-project/lib/

# Copy types
cp -r types/* your-project/types/

# Copy middleware
cp api-routes/middleware.ts your-project/middleware.ts

# Copy package.json dependencies
# (merge with your existing package.json)

# Copy environment variables
cp .env.example your-project/.env.local
```

### 2. Install Dependencies

```bash
cd your-project
npm install
```

### 3. Configure Environment Variables

Edit `.env.local`:

```env
MONGODB_URI=your-mongodb-uri
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-secret-with-openssl-rand-base64-32
GOOGLE_CLIENT_ID=optional
GOOGLE_CLIENT_SECRET=optional
GITHUB_CLIENT_ID=optional
GITHUB_CLIENT_SECRET=optional
```

### 4. Create Required Directories

```bash
mkdir -p public/uploads/resumes
```

### 5. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 📋 Features Included

### ✅ Authentication & Authorization
- Email/Password authentication
- Google OAuth
- GitHub OAuth
- JWT-based sessions
- Role-based access control (Job Seeker, Recruiter, Admin)

### ✅ Resume Management
- Upload PDF/DOCX files
- Automatic parsing (skills, experience, education)
- Public/Private visibility
- CRUD operations
- Download functionality

### ✅ Job Management
- Create, read, update, delete jobs
- Search and filter
- Pagination
- Recruiter dashboard

### ✅ Application System
- Apply to jobs with existing or new resume
- Track application status
- Withdraw applications
- Recruiter candidate ranking

### ✅ AI-Powered Fit Score
- Weighted scoring algorithm (Skills 50%, Experience 30%, Keywords 20%)
- Detailed breakdown
- Missing skills detection
- Actionable improvement suggestions
- Job-specific feedback without applying

### ✅ Admin Panel
- User management
- Job moderation
- Resume moderation
- Dashboard statistics

## 🔧 API Endpoints Overview

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login (NextAuth)
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/roles` - Update user roles

### Resumes
- `POST /api/resumes/upload` - Upload resume
- `GET /api/resumes` - List user's resumes
- `GET /api/resumes/[id]` - Get single resume
- `PUT /api/resumes/[id]` - Update resume
- `DELETE /api/resumes/[id]` - Delete resume
- `GET /api/resumes/[id]/download` - Download resume

### Jobs
- `GET /api/jobs` - List all jobs (public)
- `POST /api/jobs` - Create job (recruiter)
- `GET /api/jobs/[id]` - Get single job
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs

### Applications
- `POST /api/applications` - Apply to job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/[jobId]` - Get job applications (recruiter)
- `PUT /api/applications/[id]/status` - Update application status
- `DELETE /api/applications/[id]` - Withdraw application

### Fit Score
- `POST /api/fit-score/calculate` - Calculate fit score
- `GET /api/fit-score/history` - Get fit score history

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/[id]/block` - Block/unblock user
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/jobs` - List all jobs
- `DELETE /api/admin/jobs/[id]` - Delete job
- `GET /api/admin/resumes` - List all resumes
- `DELETE /api/admin/resumes/[id]` - Delete resume
- `GET /api/admin/stats` - Get dashboard statistics

## 🗄️ Database Models

### User Model
- Authentication details
- Multiple roles support
- Job seeker and recruiter profiles

### Resume Model
- File storage
- Parsed data (skills, experience, education)
- Visibility settings

### Job Model
- Job details
- Recruiter reference
- Applicant tracking

### Application Model
- Job application tracking
- Status management
- Fit score storage

### FitScore Model
- Score breakdown
- Historical tracking

## 🔐 Security Features

- Bcrypt password hashing
- JWT session tokens
- Role-based access control
- File type validation
- File size limits
- Input sanitization
- CORS configuration
- Route protection middleware

## 📊 Fit Score Algorithm

The fit score is calculated using a weighted approach:

1. **Skills Match (50%)**
   - Compares resume skills with job requirements
   - Identifies matched and missing skills

2. **Experience Match (30%)**
   - Evaluates experience level alignment
   - Considers seniority indicators

3. **Keyword Match (20%)**
   - Analyzes relevant keywords
   - Measures overall content alignment

**Total Score**: 0-100 (higher is better)

## 🧪 Testing

### Test Authentication
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":["job_seeker"]}'
```

### Test Resume Upload
```bash
curl -X POST http://localhost:3000/api/resumes/upload \
  -F "file=@resume.pdf" \
  -F "title=My Resume" \
  -F "visibility=public" \
  -F "allowParsing=true"
```

### Test Fit Score
```bash
curl -X POST http://localhost:3000/api/fit-score/calculate \
  -H "Content-Type: application/json" \
  -d '{"resumeId":"RESUME_ID","jobId":"JOB_ID"}'
```

## 📚 Additional Documentation

- **API_DOCUMENTATION.md**: Complete API reference
- **IMPLEMENTATION_GUIDE.md**: Detailed setup and deployment guide

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **File Upload**: Next.js API Routes
- **Resume Parsing**: pdf-parse, mammoth
- **UI**: shadcn/ui components
- **Styling**: Tailwind CSS

## 📦 Dependencies

Key dependencies included:
- next: ^14.2.0
- next-auth: ^4.24.0
- mongoose: ^8.5.0
- bcryptjs: ^2.4.3
- pdf-parse: ^1.1.1
- mammoth: ^1.7.0
- And more (see package.json)

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy --prod
```

### Docker
See IMPLEMENTATION_GUIDE.md for Docker configuration

### Environment Variables for Production
Ensure all environment variables are set in your hosting platform.

## 🤝 Support

For issues or questions:
1. Check API_DOCUMENTATION.md
2. Review IMPLEMENTATION_GUIDE.md
3. Check console logs for errors
4. Verify environment variables

## 📝 License

MIT License

## 🎯 Next Steps

After setup:
1. Test all API endpoints
2. Integrate with your frontend
3. Configure OAuth providers
4. Set up MongoDB indexes
5. Implement rate limiting
6. Add monitoring and logging
7. Deploy to production

## 🔄 Version History

**V1.0.0** (Current)
- Complete API implementation
- Authentication & authorization
- Resume management & parsing
- Job management
- Application system
- Fit score calculation
- Admin panel

**Future Enhancements (V2)**
- Email notifications
- Real-time updates
- Advanced analytics
- LLM-powered suggestions
- Video interviews
- Skills assessments

---

Built with ❤️ for job seekers and recruiters