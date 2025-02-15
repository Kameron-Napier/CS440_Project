CREATE DATABASE CS440;

use CS440;

CREATE TABLE events_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_day ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    event_time TIME NOT NULL
);

CREATE TABLE Login (
	username varchar(20),
    pass varchar(20)
);