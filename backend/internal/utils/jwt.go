package utils

import (
    "time"
    "os"
    "github.com/golang-jwt/jwt/v5"
)

type JWTClaim struct {
    UserID   uint   `json:"user_id"`
    Username string `json:"username"`
    jwt.RegisteredClaims
}

func GenerateJWT(userID uint, username string) (string, error) {
    secret := os.Getenv("JWT_SECRET")

    claims := JWTClaim{
        UserID:   userID,
        Username: username,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(secret))
}
