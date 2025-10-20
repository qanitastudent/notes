package models

import "time"

type Log struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Method    string    `json:"method"`
    Path      string    `json:"path"`
    Status    int       `json:"status"`
    IP        string    `json:"ip"`
    UserAgent string    `json:"user_agent"`
    Duration  string    `json:"duration"`
    CreatedAt time.Time `json:"created_at"`
}
