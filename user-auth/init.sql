CREATE DATABASE IF NOT EXISTS user_auth;
USE user_auth;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password_hash CHAR(60) NOT NULL
);

select * from users;