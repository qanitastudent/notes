package handlers

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"notes-app/internal/database"
	"notes-app/internal/models"
)

// Limit string length to avoid heavy DB storage
func limitString(s string, max int) string {
	if len(s) > max {
		return s[:max] + "...(truncated)"
	}
	return s
}

func LoggingMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		// ====== Capture request body ======
		reqBody := ""
		if c.Request().Body() != nil {
			reqBody = string(c.Request().Body())
			reqBody = limitString(reqBody, 500)
		}

		// ====== Jalankan handler utama ======
		err := c.Next()

		duration := time.Since(start)
		statusCode := c.Response().StatusCode()
		method := c.Method()
		path := c.OriginalURL()
		ip := c.IP()
		userAgent := c.Get("User-Agent")

		// ====== Capture response body setelah Next() ======
		respBody := string(c.Response().Body())
		response := limitString(respBody, 500)

		// ====== Simpan ke database ======
		logEntry := models.Log{
			Method:     method,
			Endpoint:   path,
			Request:    reqBody,
			Response:   response,
			StatusCode: statusCode,
			IP:         ip,
			UserAgent:  userAgent,
			CreatedAt:  time.Now(),
		}


		if err := database.DB.Create(&logEntry).Error; err != nil {
			log.Printf("⚠️ Failed to save log: %v | logEntry: %+v", err, logEntry)
		}

		log.Printf("[%s] %s %s → %d (%v)", ip, method, path, statusCode, duration)
		return err
	}
}
