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
    request VARCHAR(500)
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