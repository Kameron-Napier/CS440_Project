CREATE DATABASE IF NOT EXISTS event_details;
USE event_details;

CREATE TABLE event_details (
    event_id INT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL
);