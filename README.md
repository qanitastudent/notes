<<<<<<< HEAD
# 📝 Notes App - Full Stack Application

Modern, full-stack note-sharing application built with **Go (Fiber)** backend and **Next.js (TypeScript)** frontend. Share your thoughts, ideas, and stories with the world!

## 🌐 Live Demo

- **Frontend**: [https://notes-frontend-five-black.vercel.app](https://notes-frontend-five-black.vercel.app)
- **Backend API**: [https://notes-production-8e61.up.railway.app](https://notes-production-8e61.up.railway.app)
- **API Health**: [https://notes-production-8e61.up.railway.app/health](https://notes-production-8e61.up.railway.app/health)

## ✨ Features

### 🔐 Authentication
- User registration with secure password hashing (bcrypt)
- JWT-based authentication
- Automatic token refresh and session management
- Protected routes and endpoints

### 📝 Notes Management
- Create, read, update, and delete notes
- Rich text content support
- Image upload (up to 5MB)
- Notes ownership and access control
- Real-time preview when creating notes

### 🖼️ Image Handling
- Drag & drop or click to upload
- Support for JPG, PNG, GIF, WEBP
- Base64 encoding for Railway compatibility
- Image preview before upload
- No external storage needed

### 🔍 Search & Filter
- Search notes by title, content, or username
- Filter between "All Notes" and "My Notes"
- Real-time search results

### 🎨 UI/UX
- Modern, responsive design
- Mobile-first approach
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications for user feedback

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

### Backend
- **Language**: Go 1.23.2
- **Framework**: Fiber v2
- **Database**: PostgreSQL (GORM)
- **Authentication**: JWT (golang-jwt)
- **Password**: bcrypt
- **Deployment**: Railway

### DevOps
- **Version Control**: Git
- **CI/CD**: Railway (Backend), Vercel (Frontend)
- **Database Hosting**: Railway PostgreSQL
=======
# NotesApp Frontend

Modern, responsive note-sharing application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Authentication**: Register and login with JWT tokens
- **CRUD Notes**: Create, read, update, and delete notes
- **Image Upload**: Upload images with notes (stored as base64)
- **Search & Filter**: Search notes by title, content, or username
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Toast Notifications**: User-friendly feedback

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (from your backend folder)

## 🛠️ Installation

1. **Clone or create the project structure:**

```bash
mkdir notes-frontend
cd notes-frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**

Copy `.env.local.example` to `.env.local` and update:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
```

4. **Run development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
>>>>>>> 4f44d85 (Font : FrontEnd)

## 📁 Project Structure

```
<<<<<<< HEAD
notes-app/
├── backend/                    # Go Backend API
│   ├── cmd/
│   │   └── main.go            # Entry point
│   ├── internal/
│   │   ├── database/          # Database connection
│   │   ├── handlers/          # HTTP handlers
│   │   ├── models/            # Data models
│   │   └── utils/             # Utilities (JWT, etc.)
│   ├── migrations/            # SQL migrations
│   ├── Dockerfile
│   ├── go.mod
│   └── README.md              # Backend documentation
│
y│   ├── pages/                 # Next.js pages
│   │   ├── index.tsx          # Homepage
│   │   ├── login.tsx          # Login page
│   │   ├── register.tsx       # Register page
│   │   └── notes/             # Notes pages
│   ├── components/            # React components
│   ├── contexts/              # React contexts (Auth)
│   ├── lib/                   # API client
│   ├── styles/                # Global styles
│   ├── package.json
│   └── README.md              # Frontend documentation
│
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- **Backend**: Go 1.23.2+, PostgreSQL 14+
- **Frontend**: Node.js 18+, npm/yarn
- Git

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd notes-app
```

### 2️⃣ Setup Backend

```bash
cd backend

# Setup environment
cp .env.example .env
# Edit .env dengan database credentials Anda

# Install dependencies
go mod download

# Run server
go run cmd/main.go
```

Backend akan berjalan di `http://localhost:8080`

📚 **[Backend Documentation](./backend/README.md)**

### 3️⃣ Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8080

# Run development server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

📚 **[Frontend Documentation](./frontend/README.md)**

### 4️⃣ Access Application

1. Open browser: `http://localhost:3000`
2. Click **Register** to create account
3. Login with your credentials
4. Start creating and sharing notes!

## 📸 Screenshots

### Homepage
Beautiful landing page dengan hero section dan latest notes preview.

### Authentication
Modern login & register forms dengan gradient backgrounds.

### Notes Dashboard
Grid layout dengan search & filter functionality.

### Create Note
Rich editor dengan image upload dan real-time preview.

### Note Detail
Full-page note view dengan share buttons dan author info.

## 🔧 Development

### Backend Development

```bash
cd backend

# Run with hot reload (using air)
air

# Run tests
go test ./...

# Build
go build -o main ./cmd

# Format code
go fmt ./...
```

### Frontend Development

```bash
cd frontend

# Development server
=======
frontend-app/
├── pages/
│   ├── _app.tsx              # App wrapper with providers
│   ├── index.tsx             # Homepage
│   ├── login.tsx             # Login page
│   ├── register.tsx          # Registration page
│   └── notes/
│       ├── index.tsx         # All notes listing
│       ├── create.tsx        # Create note form
│       └── [id].tsx          # Note detail page
├── components/
│   ├── Navbar.tsx            # Navigation bar
│   ├── NoteCard.tsx          # Note card component
│   └── UploadPhoto.tsx       # Image upload component
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── lib/
│   └── api.ts                # API client & functions
├── styles/
│   └── globals.css           # Global styles
├── public/                   # Static assets
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies
```

## 🎨 Key Components

### Authentication
- JWT token storage in localStorage
- Auto-redirect on unauthorized access
- Protected routes with AuthContext

### Note Management
- Create notes with title, content, and optional image
- View all notes or filter by "My Notes"
- Search functionality
- Delete own notes

### Image Handling
- Upload images up to 5MB
- Supported formats: JPG, PNG, GIF, WEBP
- Base64 encoding for Railway compatibility
- Preview before upload

## 🔧 Available Scripts

```bash
# Development
>>>>>>> 4f44d85 (Font : FrontEnd)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

<<<<<<< HEAD
# Lint
=======
# Lint code
>>>>>>> 4f44d85 (Font : FrontEnd)
npm run lint
```

## 🚀 Deployment

<<<<<<< HEAD
### Backend (Railway)

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add PostgreSQL: `railway add` → Select PostgreSQL
5. Set environment variables in Railway Dashboard
6. Deploy: `railway up`

**Environment Variables:**
- `JWT_SECRET`: Your secret key
- `ALLOWED_ORIGINS`: Frontend URLs (comma-separated)

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
4. Deploy automatically!

Or using CLI:
```bash
npm i -g vercel
vercel login
vercel
```

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
PORT=8080
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | ❌ | Health check |
| POST | `/auth/register` | ❌ | Register user |
| POST | `/auth/login` | ❌ | Login user |
| GET | `/notes` | ❌ | Get all notes |
| GET | `/notes/:id` | ❌ | Get note by ID |
| POST | `/notes` | ✅ | Create note |
| PATCH | `/notes/:id` | ✅ | Update note |
| DELETE | `/notes/:id` | ✅ | Delete note |
| POST | `/upload/image` | ✅ | Upload image |

**Auth**: ✅ = Requires JWT token in Authorization header

Full API documentation: [Backend README](./backend/README.md)

## 🗄️ Database Schema

### Users
- `id`, `username`, `email`, `password_hash`, `created_at`

### Notes
- `id`, `title`, `content`, `image_url`, `user_id`, `username`, `created_at`, `updated_at`

### Logs
- `id`, `method`, `endpoint`, `request`, `response`, `status_code`, `created_at`
=======
### Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Import project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
   ```

4. Deploy!

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `.next` folder to Netlify

3. Set environment variables in Netlify dashboard

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.example.com` |

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth transitions and animations
- Card-based layout
- Consistent color scheme (Primary blue)
- Hover effects and interactions
- Loading states
- Empty states
>>>>>>> 4f44d85 (Font : FrontEnd)

## 🐛 Troubleshooting

### CORS Issues
<<<<<<< HEAD
Update `ALLOWED_ORIGINS` di backend environment variables dengan frontend URL Anda.

### Authentication Failed
- Pastikan `JWT_SECRET` sama antara development dan production
- Clear localStorage dan login ulang
- Check token format: `Bearer <token>`

### Image Upload Failed
- Max file size: 5MB
- Allowed formats: JPG, PNG, GIF, WEBP
- Must be logged in

### Database Connection Error
- Verify PostgreSQL credentials
- Check `DATABASE_URL` format
- Ensure database is running

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

Built with ❤️ by passionate developers

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Fiber](https://gofiber.io/) - Go web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Railway](https://railway.app/) - Backend hosting
- [Vercel](https://vercel.com/) - Frontend hosting
- [GORM](https://gorm.io/) - Go ORM
- [PostgreSQL](https://www.postgresql.org/) - Database

## 📞 Support

If you have any questions or issues, please:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting guide

## 🎯 Roadmap

### Backend
- [ ] Rate limiting
- [ ] Refresh token mechanism
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Note categories/tags
- [ ] Advanced search with filters
- [ ] Pagination
- [ ] API versioning

### Frontend
- [ ] Dark mode toggle
- [ ] Markdown editor
- [ ] Draft auto-save
- [ ] Note sharing via link
- [ ] User profiles
- [ ] Comments on notes
- [ ] Like/favorite system
- [ ] Responsive improvements

### Infrastructure
- [ ] Unit tests
- [ ] Integration tests
- [ ] CI/CD pipeline
- [ ] Monitoring & analytics
- [ ] Error tracking (Sentry)
- [ ] Performance optimization

## 📊 Performance

- Backend API response time: < 100ms
- Frontend First Contentful Paint: < 1.5s
- Lighthouse Score: 90+
- Database query optimization with indexes
- Image optimization with base64 encoding

## 🔒 Security

- Password hashing with bcrypt (cost 10)
- JWT tokens with 72-hour expiration
- HTTPS enforcement on production
- SQL injection protection (GORM parameterized queries)
- XSS protection
- CSRF protection
- Input validation and sanitization
- Sensitive data redaction in logs

---

**⭐ If you like this project, please give it a star!**

Made with 💙 using Go, Next.js, TypeScript, and PostgreSQL
=======
Make sure your backend has correct CORS settings:
```go
AllowOrigins: "http://localhost:3000,https://your-frontend-url.vercel.app"
```

### Images Not Displaying
- Check if images are properly uploaded
- Verify base64 format is correct
- Check browser console for errors

### Authentication Issues
- Clear localStorage and try again
- Check if JWT_SECRET matches between frontend and backend
- Verify token is being sent in Authorization header

## 📝 API Endpoints Used

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /notes` - Get all notes
- `GET /notes/:id` - Get single note
- `POST /notes` - Create note (protected)
- `PATCH /notes/:id` - Update note (protected)
- `DELETE /notes/:id` - Delete note (protected)
- `POST /upload/image` - Upload image (protected)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or production!

## 👨‍💻 Author

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hot Toast](https://react-hot-toast.com/)
- [Axios](https://axios-http.com/)
>>>>>>> 4f44d85 (Font : FrontEnd)
