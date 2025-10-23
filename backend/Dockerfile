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

# Install PostgreSQL client (agar bisa menjalankan psql)
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Jalankan init.sql saat container start (jika belum ada tabel)
CMD sh -c "psql $DATABASE_URL -f migrations/init.sql || true && ./main"

# Expose port default
EXPOSE 8080
