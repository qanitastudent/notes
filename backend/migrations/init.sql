-- ===============================
-- USERS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- 👈 Ubah dari 'password' ke 'password_hash'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===============================
-- NOTES TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    username VARCHAR(100) NOT NULL,  -- 👈 Tambahkan field ini
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()  -- 👈 Tambahkan field ini
);

-- ===============================
-- LOGS TABLE
-- ===============================
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    method VARCHAR(10),
    endpoint TEXT,
    request TEXT,
    response TEXT,
    status_code INTEGER,
    ip VARCHAR(100),        -- 👈 Tambahkan field ini
    user_agent TEXT,        -- 👈 Tambahkan field ini
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);