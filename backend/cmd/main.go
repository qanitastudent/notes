package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"notes-app/internal/database"
	"notes-app/internal/models"
	"notes-app/internal/handlers"
	"notes-app/internal/utils"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ No .env file found, using system environment")
	}

	database.ConnectDB()
	database.DB.AutoMigrate(&models.User{}, &models.Note{}, &models.Log{})

	app := fiber.New()

	// Pasang logging middleware di sini
	app.Use(handlers.LoggingMiddleware())

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000,https://notes-production.up.railway.app",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PATCH,DELETE,OPTIONS",
	}))


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
	log.Fatal(app.Listen(":" + port)) // Fiber sendiri yang handle listen
}

