DROP DATABASE CS440;

CREATE DATABASE CS440;

use CS440;

CREATE TABLE events_schedule (
    event_name VARCHAR(255) NOT NULL,
    event_day ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
    event_start_time TIME NOT NULL,
    event_end_time TIME NOT NULL
);

CREATE TABLE Login (
	username varchar(20),
    pass varchar(20)
);

#for testing
insert into Login(username, pass) VALUES ("nmg295", "password1234");

select * from events_schedule;
select * from Login;