DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS hike_schedule;
DROP TABLE IF EXISTS hike_details;
DROP TABLE IF EXISTS users;

-- Users table (auth system)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user'
);

-- Static hike info
CREATE TABLE hike_details (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(20),
  image_url TEXT
);

-- Scheduled hikes (admin adds dates/times)
CREATE TABLE hike_schedule (
  id SERIAL PRIMARY KEY,
  hike_id INT REFERENCES hike_details(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  max_capacity INT
);

-- Reservations (user-booked)
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  schedule_id INT REFERENCES hike_schedule(id),
  user_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert 4 hikes
INSERT INTO hike_details (name, location, description, difficulty, image_url) VALUES
('Wadi Al-Hasa', 'Karak', 'Explore the longest valley in Jordan with water trails.', 'Moderate', '/hasa.jpg'),
('Wadi Al-Mujib', 'Madaba', 'Breathtaking canyon with water stream hikes.', 'Hard', '/mujib.jpg'),
('Wadi Hidan', 'Madaba', 'Adventurous hike with waterfalls and swimming.', 'Hard', '/hedan.jpg'),
('Wadi Bani Hammad', 'Karak', 'Scenic hike through a lush green valley.', 'Easy', '/bani.jpg');

INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@hikeshabab.com', 'admin', 'admin');


INSERT INTO hike_schedule (hike_id, date, time, max_capacity) VALUES
(1, CURRENT_DATE + INTERVAL '10 days', '08:00', 20),
(2, CURRENT_DATE + INTERVAL '12 days', '09:00', 15);



