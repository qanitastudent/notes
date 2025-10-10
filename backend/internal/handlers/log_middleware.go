package handlers

import (
	"log"
	"time"

	"notes-app/internal/database"
	"notes-app/internal/models"

	"github.com/gofiber/fiber/v2"
)

func LoggingMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		// lanjut ke handler berikutnya
		err := c.Next()

		// ambil request & response
		reqBody := string(c.Request().Body())
		resBody := string(c.Response().Body())

		// log ke console
		log.Printf("%s %s %d %s", c.Method(), c.Path(), c.Response().StatusCode(), time.Since(start))

		// log ke database
		logEntry := models.Log{
			Method:     c.Method(),
			Endpoint:   c.Path(),
			Request:    reqBody,
			Response:   resBody,
			StatusCode: c.Response().StatusCode(),
			CreatedAt:  time.Now(),
		}
		if err := database.DB.Create(&logEntry).Error; err != nil {
			log.Printf("Failed to save log: %v", err)
		}

		return err
	}
}
