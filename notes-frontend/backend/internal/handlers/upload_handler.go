package handlers

import (
	"encoding/base64"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

const (
	MaxFileSize = 5 * 1024 * 1024 // 5MB
)

// UploadImage - Store image as base64 in database (Railway compatible)
func UploadImage(c *fiber.Ctx) error {
	// Get file from request
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No image file provided",
		})
	}

	// Validate file size
	if file.Size > MaxFileSize {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "File size exceeds 5MB limit",
		})
	}

	// Validate file type
	contentType := file.Header.Get("Content-Type")
	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/jpg":  true,
		"image/png":  true,
		"image/gif":  true,
		"image/webp": true,
	}

	if !allowedTypes[contentType] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed",
		})
	}

	// Read file content
	fileContent, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to read file",
		})
	}
	defer fileContent.Close()

	// Read file bytes
	fileBytes := make([]byte, file.Size)
	_, err = fileContent.Read(fileBytes)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to read file content",
		})
	}

	// Convert to base64
	base64String := base64.StdEncoding.EncodeToString(fileBytes)

	// Create data URL (dapat disimpan langsung di database atau dikirim ke frontend)
	dataURL := fmt.Sprintf("data:%s;base64,%s", contentType, base64String)

	// Return base64 langsung (Frontend akan simpan di note)
	return c.JSON(fiber.Map{
		"url": dataURL,
	})
}

// DeleteImage - No-op for base64 approach (data stored in note itself)
func DeleteImage(c *fiber.Ctx) error {
	// Untuk base64, tidak perlu delete file karena data ada di database note
	return c.JSON(fiber.Map{
		"message": "Image reference removed",
	})
}