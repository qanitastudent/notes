package models

import "time"

type Log struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Method     string    `json:"method"`
	Endpoint   string    `json:"endpoint"`
	Request    string    `json:"request"`
	Response   string    `json:"response"`
	StatusCode int       `json:"status_code"`
	CreatedAt  time.Time `json:"created_at"`
}
