-- users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- notes table
CREATE TABLE IF NOT EXISTS notes (
    d SERIAL PRIMARY KEY,
    ser_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    itle TEXT NOT NULL,
    ontent TEXT,
    mage_url TEXT,
    reated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- logs table
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    method VARCHAR(10),
    endpoint TEXT,
    headers JSONB,
    payload JSONB,
    response_body JSONB,
    response_status INTEGER
);

-- users: menyimpan akun user dengan password_hash (untuk bcrypt).

-- notes: setiap catatan terhubung ke users.id.

-- logs: untuk mencatat request/response dari backend nanti.