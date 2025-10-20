package handlers

import (
	"strconv"
	"github.com/gofiber/fiber/v2"
	"notes-app/internal/database"
	"notes-app/internal/models"
)

// GetLogs - Get all logs with pagination
func GetLogs(c *fiber.Ctx) error {
	var logs []models.Log
	
	// Pagination
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "50"))
	offset := (page - 1) * limit
	
	// Query
	query := database.DB.Order("created_at DESC").Limit(limit).Offset(offset)
	
	if err := query.Find(&logs).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	
	// Count total
	var total int64
	database.DB.Model(&models.Log{}).Count(&total)
	
	return c.JSON(fiber.Map{
		"logs":  logs,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetLogStats - Get statistics
func GetLogStats(c *fiber.Ctx) error {
	type MethodStats struct {
		Method string `json:"method"`
		Count  int64  `json:"count"`
	}
	
	var stats []MethodStats
	
	database.DB.Model(&models.Log{}).
		Select("method, COUNT(*) as count").
		Group("method").
		Scan(&stats)
	
	// Error count
	var errorCount int64
	database.DB.Model(&models.Log{}).Where("status_code >= 400").Count(&errorCount)
	
	// Success count
	var successCount int64
	database.DB.Model(&models.Log{}).Where("status_code < 400").Count(&successCount)
	
	// Total
	var total int64
	database.DB.Model(&models.Log{}).Count(&total)
	
	return c.JSON(fiber.Map{
		"by_method":     stats,
		"error_count":   errorCount,
		"success_count": successCount,
		"total":         total,
	})
}

// ClearLogs - Clear all logs (Admin only)
func ClearLogs(c *fiber.Ctx) error {
	result := database.DB.Exec("TRUNCATE TABLE logs RESTART IDENTITY CASCADE")
	
	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to clear logs",
		})
	}
	
	return c.JSON(fiber.Map{
		"message": "All logs cleared successfully",
	})
}