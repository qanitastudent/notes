package handlers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"notes-app/internal/database"
	"notes-app/internal/models"
)

// Get all notes
func GetNotes(c *fiber.Ctx) error {
	var notes []models.Note
	if err := database.DB.Order("created_at DESC").Find(&notes).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(notes)
}

// Get note by ID
func GetNoteByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid note ID"})
	}

	var note models.Note
	if err := database.DB.First(&note, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Note not found"})
	}
	return c.JSON(note)
}

// Create a note
func CreateNote(c *fiber.Ctx) error {
	var input struct {
		Title    string `json:"title"`
		Content  string `json:"content"`
		ImageURL string `json:"image_url"` // Tambahkan field ini
	}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	user := c.Locals("user").(*models.User)

	note := models.Note{
		Title:     input.Title,
		Content:   input.Content,
		ImageURL:  input.ImageURL, // Set image URL
		UserID:    user.ID,
		Username:  user.Username,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := database.DB.Create(&note).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(note)
}

// Update note
func UpdateNote(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid note ID"})
	}

	var note models.Note
	if err := database.DB.First(&note, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Note not found"})
	}

	userID := c.Locals("user_id").(uint)
	if note.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "You are not the owner of this note"})
	}

	var input struct {
		Title    string `json:"title"`
		Content  string `json:"content"`
		ImageURL string `json:"image_url"` // Tambahkan field ini
	}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	note.Title = input.Title
	note.Content = input.Content
	note.ImageURL = input.ImageURL // Update image URL
	note.UpdatedAt = time.Now()

	if err := database.DB.Save(&note).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(note)
}

// Delete note
func DeleteNote(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid note ID"})
	}

	var note models.Note
	if err := database.DB.First(&note, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Note not found"})
	}

	userID := c.Locals("user_id").(uint)
	if note.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "You are not the owner of this note"})
	}

	if err := database.DB.Delete(&note).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Note deleted successfully"})
}