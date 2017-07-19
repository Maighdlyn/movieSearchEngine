DROP DATABASE IF EXISTS moviesdb;
CREATE DATABASE moviesdb;

\c moviesdb

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS history;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE history(
  id SERIAL PRIMARY KEY,
  movie TEXT,
  user_id INT,
  searchdate date NOT NULL DEFAULT CURRENT_DATE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
