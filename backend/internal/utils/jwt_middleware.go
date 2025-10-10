package utils

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"


	"notes-app/internal/database" // <- untuk akses DB
	"notes-app/internal/models"   // <- untuk struct User
)

func JWTProtected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := c.Get("Authorization")
		if auth == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing token"})
		}

		tokenString := auth[len("Bearer "):]
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			secret = "secret123"
		}

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})
		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
		}

		claims := token.Claims.(jwt.MapClaims)

		// Ambil user dari DB dan set ke c.Locals("user")
		var user models.User
		userID := uint(claims["user_id"].(float64))
		if err := database.DB.First(&user, userID).Error; err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User not found"})
		}

		c.Locals("user", &user)
		c.Locals("user_id", user.ID)
		c.Locals("username", user.Username)
		return c.Next()
	}
}
