-- Database Schema for Event Scheduler

-- Drop database if it exists (use with caution in production)
DROP DATABASE IF EXISTS CS440;

-- Create database
CREATE DATABASE CS440;

-- Use the database
USE CS440;

-- Users table for authentication
CREATE TABLE Login (
    username VARCHAR(20) PRIMARY KEY,
    password_hash CHAR(60) NOT NULL
);

-- Events schedule table
CREATE TABLE events_schedule (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    event_name VARCHAR(35) NOT NULL,
    event_day ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    event_start_time TIME NOT NULL,
    event_end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES Login(username) ON DELETE CASCADE
);

-- Create indexes for improved query performance
CREATE INDEX idx_events_username ON events_schedule(username);
CREATE INDEX idx_events_day ON events_schedule(event_day);
