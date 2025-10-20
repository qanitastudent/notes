package handlers

import (
    "log"
    "time"

    "github.com/gofiber/fiber/v2"
    "notes-app/internal/database"
    "notes-app/internal/models"
)

// LoggingMiddleware mencatat setiap request ke tabel logs
func LoggingMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        start := time.Now()

        // Jalankan request
        err := c.Next()

        duration := time.Since(start)

        // Simpan log ke database
        logEntry := models.Log{
            Method:    c.Method(),
            Path:      c.Path(),
            Status:    c.Response().StatusCode(),
            IP:        c.IP(),
            UserAgent: string(c.Request().Header.UserAgent()),
            Duration:  duration.String(),
            CreatedAt: time.Now(),
        }

        if dbErr := database.DB.Create(&logEntry).Error; dbErr != nil {
            log.Printf("❌ Failed to save log: %v", dbErr)
        }

        return err
    }
}
