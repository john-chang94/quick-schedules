CREATE DATABASE quick-schedules;

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    is_admin BOOLEAN NOT NULL
);

CREATE TABLE users (
    u_id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES roles(role_id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    hourly_pay DECIMAL NOT NULL,
    started_at DATE NOT NULL,
    updated_at DATE
);

CREATE TABLE availability (
    a_id SERIAL PRIMARY KEY,
    u_id INT NOT NULL REFERENCES users(u_id),
    mon VARCHAR(50),
    tue VARCHAR(50),
    wed VARCHAR(50),
    thur VARCHAR(50),
    fri VARCHAR(50),
    sat VARCHAR(50),
    sun VARCHAR(50),
    notes VARCHAR(255),
    updated_at DATE
);

CREATE TABLE requests (
    r_id SERIAL PRIMARY KEY,
    u_id INT NOT NULL REFERENCES users(u_id),
    date DATE NOT NULL,
    notes VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Pending'
);

CREATE TABLE request_days (
    rd_id SERIAL PRIMARY KEY,
    u_id INT NOT NULL REFERENCES users(u_id),
    r_id INT NOT NULL REFERENCES requests(r_id)
    date DATE NOT NULL
)

CREATE TABLE presets (
    p_id SERIAL PRIMARY KEY,
    shift_start VARCHAR(25) NOT NULL,
    shift_end VARCHAR(25) NOT NULL,
    shift_start_value VARCHAR(25) NOT NULL,
    shift_end_value VARCHAR(25) NOT NULL,
    level DECIMAL
);

CREATE TABLE times (
    t_id SERIAL PRIMARY KEY,
    time VARCHAR(25) NOT NULL,
    value VARCHAR(25) NOT NULL,
    level DECIMAL
);

CREATE TABLE shifts (
    s_id SERIAL PRIMARY KEY,
    u_id INT NOT NULL REFERENCES users(u_id),
    shift_start TIMESTAMP,
    shift_end TIMESTAMP
);

INSERT INTO roles (title)
VALUES
('General Manager'),
('Assistant Manager'),
('Supervisor'),
('Shift Lead'),
('Team Member'),
('Trainee');

INSERT INTO times (time, value, level)
VALUES ('12:00 AM', '0 0', 0),
('12:30 AM', '0 30', 0.5),
('1:00 AM', '1 0', 1.0),
('1:30 AM', '1 30', 1.5),
('2:00 AM', '2 0', 2.0),
('2:30 AM', '2 30', 2.5),
('3:00 AM', '3 0', 3.0),
('3:30 AM', '3 30', 3.5),
('4:00 AM', '4 0', 4.0),
('4:30 AM', '4 30', 4.5),
('5:00 AM', '5 0', 5.0),
('5:30 AM', '5 30', 5.5),
('6:00 AM', '6 0', 6.0),
('6:30 AM', '6 30', 6.5),
('7:00 AM', '7 0', 7.0),
('7:30 AM', '7 30', 7.5),
('8:00 AM', '8 0', 8.0),
('8:30 AM', '8 30', 8.5),
('9:00 AM', '9 0', 9.0),
('9:30 AM', '9 30', 9.5),
('10:00 AM', '10 0', 10.0),
('10:30 AM', '10 30', 10.5),
('11:00 AM', '11 0', 11.0),
('11:30 AM', '11 30', 11.5),
('12:00 PM', '12 0', 12.0),
('12:30 PM', '12 30', 12.5),
('1:00 PM', '13 0', 13.0),
('1:30 PM', '13 30', 13.5),
('2:00 PM', '14 0', 14.0),
('2:30 PM', '14 30', 14.5),
('3:00 PM', '15 0', 15.0),
('3:30 PM', '15 30', 15.5),
('4:00 PM', '16 0', 16.0),
('4:30 PM', '16 30', 16.5),
('5:00 PM', '17 0', 17.0),
('5:30 PM', '17 30', 17.5),
('6:00 PM', '18 0', 18.0),
('6:30 PM', '18 30', 18.5),
('7:00 PM', '19 0', 19.0),
('7:30 PM', '19 30', 19.5),
('8:00 PM', '20 0', 20.0),
('8:30 PM', '20 30', 20.5),
('9:00 PM', '21 0', 21.0),
('9:30 PM', '21 30', 21.5),
('10:00 PM', '22 0', 22.0),
('10:30 PM', '22 30', 22.5),
('11:00 PM', '23 0', 23.0),
('11:30 PM', '23 30', 23.5);