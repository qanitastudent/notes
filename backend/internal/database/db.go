package database

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	var dsn string

	if os.Getenv("DATABASE_URL") != "" {
		// Railway format: postgresql://...
		url := os.Getenv("DATABASE_URL")
		// Pastikan gunakan sslmode=require untuk production
		dsn = url + "?sslmode=require"
	} else {
		// Lokal fallback
		dsn = "host=" + os.Getenv("DB_HOST") +
			" user=" + os.Getenv("DB_USER") +
			" password=" + os.Getenv("DB_PASSWORD") +
			" dbname=" + os.Getenv("DB_NAME") +
			" port=" + os.Getenv("DB_PORT") +
			" sslmode=disable"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("❌ Failed to connect database: %v", err)
	}

	DB = db
	log.Println("✅ Database connected to:", os.Getenv("DATABASE_URL"))
}
