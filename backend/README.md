# Notes App - Backend API

REST API untuk aplikasi Notes Sharing yang dibangun dengan Go (Golang) menggunakan framework Fiber dan PostgreSQL database.

## 🚀 Features

- **Authentication & Authorization**
  - User registration dengan password hashing (bcrypt)
  - JWT-based authentication
  - Protected routes dengan middleware

- **Notes Management**
  - CRUD operations untuk notes
  - Notes dikaitkan dengan user (ownership)
  - Support image upload (base64 encoding)
  - Soft delete dengan validasi ownership

- **Image Handling**
  - Upload image hingga 5MB
  - Support format: JPG, PNG, GIF, WEBP
  - Convert ke base64 untuk Railway compatibility
  - Store langsung di database (no file storage)

- **Logging & Monitoring**
  - Request/response logging ke database
  - Sensitive data redaction (password)
  - Health check endpoint

- **Security**
  - CORS configuration
  - JWT token validation
  - Password hashing dengan bcrypt
  - Input validation

## 📋 Tech Stack

- **Language**: Go 1.23.2
- **Framework**: Fiber v2
- **Database**: PostgreSQL (via GORM)
- **Authentication**: JWT (golang-jwt/jwt)
- **Password**: bcrypt
- **Deployment**: Railway

## 📁 Project Structure

```
backend/
├── cmd/
│   └── main.go                 # Entry point aplikasi
├── internal/
│   ├── database/
│   │   └── db.go              # Database connection
│   ├── handlers/
│   │   ├── auth_handler.go    # Register & Login
│   │   ├── note_handler.go    # CRUD Notes
│   │   ├── upload_handler.go  # Image upload
│   │   └── log_middleware.go  # Request logging
│   ├── models/
│   │   ├── user.go            # User model
│   │   ├── note.go            # Note model
│   │   └── log.go             # Log model
│   └── utils/
│       ├── jwt.go             # JWT generation
│       └── jwt_middleware.go  # JWT validation middleware
├── migrations/
│   └── init.sql               # Database schema
├── .env.example               # Environment variables template
├── Dockerfile                 # Docker configuration
├── Procfile                   # Railway deployment config
├── go.mod                     # Go dependencies
└── go.sum                     # Dependency checksums
```

## 🛠️ Installation

### Prerequisites
- Go 1.23.2 atau lebih baru
- PostgreSQL 14+
- Railway CLI (untuk deployment)

### Local Development

1. **Clone repository:**
```bash
git clone <repository-url>
cd backend
```

2. **Setup environment variables:**
```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=notesdb
JWT_SECRET=your_secret_key_here
```

3. **Install dependencies:**
```bash
go mod download
```

4. **Setup database:**
```bash
# Buat database
createdb notesdb

# Optional: Run migration script
psql -d notesdb -f migrations/init.sql
```

5. **Run application:**
```bash
go run cmd/main.go
```

Server akan berjalan di `http://localhost:8080`

## 📡 API Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Notes

#### Get All Notes
```http
GET /notes
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "My First Note",
    "content": "This is the content",
    "image_url": "data:image/jpeg;base64,...",
    "user_id": 1,
    "username": "johndoe",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
]
```

#### Get Note by ID
```http
GET /notes/:id
```

#### Create Note (Protected)
```http
POST /notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Note",
  "content": "Note content here",
  "image_url": "data:image/jpeg;base64,..."
}
```

#### Update Note (Protected)
```http
PATCH /notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "image_url": "data:image/jpeg;base64,..."
}
```

#### Delete Note (Protected)
```http
DELETE /notes/:id
Authorization: Bearer <token>
```

### Upload

#### Upload Image (Protected)
```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

**Response:**
```json
{
  "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "API is healthy"
}
```

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Railway) | No | - |
| `DB_HOST` | Database host | No | localhost |
| `DB_PORT` | Database port | No | 5432 |
| `DB_USER` | Database user | No | postgres |
| `DB_PASSWORD` | Database password | No | postgres |
| `DB_NAME` | Database name | No | notesdb |
| `JWT_SECRET` | Secret key untuk JWT | No | secret123 |
| `PORT` | Server port | No | 8080 |
| `ALLOWED_ORIGINS` | CORS allowed origins | No | localhost:3000 |

## 🚀 Deployment

### Deploy to Railway

1. **Install Railway CLI:**
```bash
npm i -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Initialize project:**
```bash
railway init
```

4. **Add PostgreSQL:**
```bash
railway add
# Pilih PostgreSQL
```

5. **Set environment variables di Railway Dashboard:**
```
JWT_SECRET=your_production_secret
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

6. **Deploy:**
```bash
railway up
```

Railway akan otomatis:
- Detect Go project
- Set `DATABASE_URL` dari PostgreSQL addon
- Run migrations via GORM AutoMigrate
- Deploy aplikasi

### Using Docker

```bash
# Build image
docker build -t notes-backend .

# Run container
docker run -p 8080:8080 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=your_secret \
  notes-backend
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Notes Table
```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Logs Table
```sql
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    method VARCHAR(10),
    endpoint TEXT,
    request TEXT,
    response TEXT,
    status_code INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🔧 Development

### Run Tests
```bash
go test ./...
```

### Build
```bash
go build -o main ./cmd
```

### Run Binary
```bash
./main
```

### Format Code
```bash
go fmt ./...
```

### Lint
```bash
golangci-lint run
```

## 🐛 Troubleshooting

### CORS Issues
Pastikan frontend origin sudah ditambahkan di `ALLOWED_ORIGINS`:
```go
AllowOrigins: "http://localhost:3000,https://your-frontend.vercel.app"
```

### Database Connection Failed
- Cek `DATABASE_URL` atau credentials di `.env`
- Pastikan PostgreSQL running
- Verify network connectivity

### JWT Invalid Token
- Cek `JWT_SECRET` sama di semua environment
- Token expired (default 72 jam)
- Token format: `Bearer <token>`

### Image Upload Failed
- Max size: 5MB
- Allowed types: JPG, PNG, GIF, WEBP
- Must be authenticated

## 📝 Notes

- **Password Security**: Semua password di-hash dengan bcrypt sebelum disimpan
- **JWT Expiration**: Token berlaku 72 jam sejak dibuat
- **Image Storage**: Gambar disimpan sebagai base64 di database (Railway-friendly)
- **Auto Migration**: GORM akan otomatis membuat/update tabel saat startup
- **Request Logging**: Semua request dicatat ke database dengan sensitive data redaction

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - bebas digunakan untuk pembelajaran atau production!

## 👨‍💻 Author

Built with ❤️ using Go, Fiber, and PostgreSQL

## 🔗 Links

- [Fiber Documentation](https://docs.gofiber.io/)
- [GORM Documentation](https://gorm.io/docs/)
- [Railway Documentation](https://docs.railway.app/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 📊 API Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Invalid input) |
| 401 | Unauthorized (Missing/invalid token) |
| 403 | Forbidden (Not owner) |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🎯 Roadmap

- [ ] Rate limiting
- [ ] Refresh token mechanism
- [ ] Email verification
- [ ] Password reset
- [ ] Note categories/tags
- [ ] Search functionality
- [ ] Pagination
- [ ] File storage integration (S3/Cloudinary)
- [ ] GraphQL API
- [ ] WebSocket for real-time updates