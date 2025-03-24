-- auth-db/init.sql
CREATE DATABASE IF NOT EXISTS auth_db;
USE auth_db;

CREATE USER 'auth_user'@'%' IDENTIFIED BY 'auth_pass';
GRANT ALL PRIVILEGES ON auth_db.* TO 'auth_user'@'%';
FLUSH PRIVILEGES;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password_hash CHAR(60) NOT NULL
);

-- Remove the SELECT statement here