# Gunakan image Go resmi
FROM golang:1.23.2

# Set working directory di dalam container
WORKDIR /app

# Copy go.mod dan go.sum dulu untuk caching dependency
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy seluruh project setelah dependency
COPY . .

# Build binary dari cmd/main.go
RUN go build -o main ./cmd

# Jalankan aplikasi (GORM AutoMigrate akan handle schema)
CMD ["./main"]

# Expose port default
EXPOSE 8080