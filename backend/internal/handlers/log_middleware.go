package handlers

import (
	"log"
	"strings"
	"time"

	"notes-app/internal/database"
	"notes-app/internal/models"

	"github.com/gofiber/fiber/v2"
)

func LoggingMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		// Lanjut ke handler berikutnya
		err := c.Next()

		// Ambil request body
		reqBody := string(c.Request().Body())

		// Redact sensitive fields
		if strings.Contains(c.Path(), "/auth/register") || strings.Contains(c.Path(), "/auth/login") {
			reqBody = redactSensitive(reqBody)
		}

		// Truncate jika terlalu panjang
		if len(reqBody) > 500 {
			reqBody = reqBody[:500] + "...(truncated)"
		}

		// Ambil response body
		resBody := string(c.Response().Body())
		if len(resBody) > 500 {
			resBody = resBody[:500] + "...(truncated)"
		}

		// Log ke console
		log.Printf("%s %s %d %s", c.Method(), c.Path(), c.Response().StatusCode(), time.Since(start))

		// Simpan ke database
		logEntry := models.Log{
			Method:     c.Method(),
			Endpoint:   c.Path(),
			Request:    reqBody,
			Response:   resBody,
			StatusCode: c.Response().StatusCode(),
			CreatedAt:  time.Now(),
		}
		if dbErr := database.DB.Create(&logEntry).Error; dbErr != nil {
			log.Printf("Failed to save log: %v", dbErr)
		}

		return err
	}
}

// redactSensitive mengganti password dengan [REDACTED]
func redactSensitive(body string) string {
	// contoh sederhana: ganti "password":"..." menjadi [REDACTED]
	body = strings.ReplaceAll(body, `"password":"`, `"password":"[REDACTED]`)
	return body
}
