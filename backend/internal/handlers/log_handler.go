package handlers

import (
    "github.com/gofiber/fiber/v2"
    "notes-app/internal/database"
    "notes-app/internal/models"
    "time"
)

// GetLogs menampilkan semua log dari database
func GetLogs(c *fiber.Ctx) error {
    var logs []models.Log

    if err := database.DB.Order("created_at desc").Find(&logs).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to fetch logs",
        })
    }

    return c.JSON(logs)
}

// GetLogStats menampilkan statistik log (jumlah total, 7 hari terakhir, dll)
func GetLogStats(c *fiber.Ctx) error {
    var total int64
    var last7Days int64

    database.DB.Model(&models.Log{}).Count(&total)
    database.DB.Model(&models.Log{}).
        Where("created_at >= ?", time.Now().AddDate(0, 0, -7)).
        Count(&last7Days)

    return c.JSON(fiber.Map{
        "total_logs":      total,
        "logs_last_7days": last7Days,
    })
}

// ClearLogs menghapus semua data log
func ClearLogs(c *fiber.Ctx) error {
    if err := database.DB.Exec("DELETE FROM logs").Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to clear logs",
        })
    }

    return c.JSON(fiber.Map{
        "message": "All logs have been cleared successfully",
    })
}
