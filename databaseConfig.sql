DROP DATABASE CS440;

CREATE DATABASE CS440;

USE CS440;

CREATE TABLE events_schedule (
    event_name VARCHAR(35) NOT NULL,
    event_day ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    event_start_time TIME NOT NULL,
    event_end_time TIME NOT NULL,
    PRIMARY KEY (event_name)
);

CREATE TABLE Login (
    username VARCHAR(20) PRIMARY KEY,
    password_hash CHAR(60) NOT NULL -- For bcrypt hashes
);

-- Note: When inserting users, use bcrypt to hash passwords first
#for testing
#insert into Login(username, pass) VALUES ("nmg295", "password1234");

#select * from events_schedule;
select * from Login;