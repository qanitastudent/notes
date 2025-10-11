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
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ No .env file found, using system environment")
	}

	database.ConnectDB()
	database.DB.AutoMigrate(&models.User{}, &models.Note{}, &models.Log{})

	app := fiber.New()

	// Logging middleware
	app.Use(handlers.LoggingMiddleware())

	// CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000,https://notes-production.up.railway.app",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PATCH,DELETE,OPTIONS",
	}))

	// Fix: jangan redirect kalau sudah via proxy HTTPS
	app.Use(func(c *fiber.Ctx) error {
		if c.Get("X-Forwarded-Proto") == "https" {
			return c.Next()
		}
		// kalau datang dari HTTP langsung (misal akses langsung tanpa proxy)
		if c.Protocol() == "http" {
			return c.Redirect("https://"+c.Hostname()+c.OriginalURL(), fiber.StatusPermanentRedirect)
		}
		return c.Next()
	})

	// Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Notes Sharing API is running 🚀")
	})

	auth := app.Group("/auth")
	auth.Post("/register", handlers.Register)
	auth.Post("/login", handlers.Login)

	notes := app.Group("/notes")
	notes.Get("/", handlers.GetNotes)
	notes.Get("/:id", handlers.GetNoteByID)
	notes.Post("/", utils.JWTProtected(), handlers.CreateNote)
	notes.Patch("/:id", utils.JWTProtected(), handlers.UpdateNote)
	notes.Delete("/:id", utils.JWTProtected(), handlers.DeleteNote)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server running on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
