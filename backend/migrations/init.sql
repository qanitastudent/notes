-- ===============================
-- USERS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===============================
-- NOTES TABLE
-- Setiap catatan dimiliki oleh user tertentu
-- ===============================
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===============================
-- LOGS TABLE
-- Menyimpan aktivitas request/response untuk audit dan debugging
-- ===============================
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    method VARCHAR(10),
    endpoint TEXT,
    request TEXT,
    response TEXT,
    status_code INTEGER,
    ip VARCHAR(100),
    user_agent TEXT,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
