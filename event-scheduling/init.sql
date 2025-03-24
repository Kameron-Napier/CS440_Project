CREATE DATABASE IF NOT EXISTS event_scheduling;
USE event_scheduling;

CREATE TABLE event_schedule (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_name VARCHAR(35) NOT NULL,
    event_day ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 
                  'Thursday', 'Friday', 'Saturday') NOT NULL
);