CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS anime (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    year VARCHAR(20),
    genre VARCHAR(255),
    poster_url TEXT,
    trailer_url TEXT
);

CREATE TABLE IF NOT EXISTS episode (
    id SERIAL PRIMARY KEY,
    anime_id INT REFERENCES anime(id),
    episode_number INT,
    video_url TEXT
);

CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    anime_id INT NOT NULL REFERENCES anime(id) ON DELETE CASCADE,
    CONSTRAINT uk_favorites_user_anime UNIQUE (user_id, anime_id)
);

CREATE TABLE IF NOT EXISTS forgot_password (
    id SERIAL PRIMARY KEY,
    otp INT,
    expiration_time TIMESTAMP NOT NULL,
    reset_token VARCHAR(255) UNIQUE,
    user_id VARCHAR(36) UNIQUE REFERENCES users(id) ON DELETE CASCADE
);
