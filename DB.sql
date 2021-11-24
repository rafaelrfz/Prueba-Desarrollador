create database simon_books;

use simon_books;

CREATE TABLE scores (
id INT(3) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30) NOT NULL,
score VARCHAR(30) NOT NULL,
level VARCHAR(50) NOT NULL
);