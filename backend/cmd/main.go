package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	"notes-app/internal/database"
	"notes-app/internal/handlers"
	"notes-app/internal/models"
	"notes-app/internal/utils"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ No .env file found, using system environment")
	}

	// Connect to database
	database.ConnectDB()
	database.DB.AutoMigrate(&models.User{}, &models.Note{}, &models.Log{})

	app := fiber.New()

	// Logging middleware
	app.Use(handlers.LoggingMiddleware())

	// CORS (izin frontend) - PERBAIKI TRAILING SLASH
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000,https://notes-production-8e61.up.railway.app",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET,POST,PATCH,DELETE,OPTIONS",
		AllowCredentials: true,
	}))

	// Middleware untuk mendukung proxy Railway dan HTTPS
	app.Use(func(c *fiber.Ctx) error {
		// Cek header dari Railway
		proto := c.Get("X-Forwarded-Proto")

		// Kalau datang lewat HTTPS (via proxy)
		if proto == "https" {
			c.Request().Header.Set("X-Forwarded-Proto", "https")
			return c.Next()
		}

		// Kalau datang lewat HTTP biasa, redirect ke versi HTTPS
		if c.Protocol() == "http" {
			return c.Redirect("https://"+c.Hostname()+c.OriginalURL(), fiber.StatusPermanentRedirect)
		}

		return c.Next()
	})

	// Routes utama
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Notes Sharing API is running 🚀")
	})

	// Auth routes
	auth := app.Group("/auth")
	auth.Post("/register", handlers.Register)
	auth.Post("/login", handlers.Login)

	// Notes routes
	notes := app.Group("/notes")
	notes.Get("/", handlers.GetNotes)
	notes.Get("/:id", handlers.GetNoteByID)
	notes.Post("/", utils.JWTProtected(), handlers.CreateNote)
	notes.Patch("/:id", utils.JWTProtected(), handlers.UpdateNote)
	notes.Delete("/:id", utils.JWTProtected(), handlers.DeleteNote)

	// Upload routes (NEW)
	upload := app.Group("/upload")
	upload.Post("/image", utils.JWTProtected(), handlers.UploadImage)
	upload.Delete("/image", utils.JWTProtected(), handlers.DeleteImage)

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
			"message": "API is healthy",
		})
	})

	// Tentukan port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server running on port %s", port)
	log.Fatal(app.Listen(":" + port))
}