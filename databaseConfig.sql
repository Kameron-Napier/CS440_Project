DROP DATABASE IF EXISTS CS440;
CREATE DATABASE CS440;
USE CS440;

CREATE TABLE Login (
    username VARCHAR(20) PRIMARY KEY,
    password_hash CHAR(60) NOT NULL
);

CREATE TABLE events_schedule (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    event_name VARCHAR(35) NOT NULL,
    event_day ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    event_start_time TIME NOT NULL,
    event_end_time TIME NOT NULL,
    FOREIGN KEY (username) REFERENCES Login(username)
);

#for testing
#insert into Login(username, pass) VALUES ("nmg295", "password1234");

#select * from events_schedule;
select * from Login;