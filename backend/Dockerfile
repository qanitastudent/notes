# Gunakan image Go
FROM golang:1.23.2

# Set working directory di dalam container
WORKDIR /app

# Copy semua file (karena sekarang root-nya sudah di backend)
COPY . .

# Download dependencies
RUN go mod download

# Build binary dari cmd/main.go
RUN go build -o main ./cmd

# Jalankan binary
CMD ["./main"]

# Expose port default
EXPOSE 8080
