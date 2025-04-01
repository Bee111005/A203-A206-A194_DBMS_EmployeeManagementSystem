CREATE DATABASE IF NOT EXISTS employeems;
USE employeems;

CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
ALTER TABLE admin ADD CONSTRAINT unique_email UNIQUE (email);


CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    salary DECIMAL(10, 2),
    address VARCHAR(255),
    image VARCHAR(255),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  date DATE,
  status ENUM('Present', 'Absent', 'Leave'),
  FOREIGN KEY (employee_id) REFERENCES employee(id)
);



CREATE TABLE admin_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    category_id INT,
    address TEXT,
    image VARCHAR(255),
    salary DECIMAL(10,2),
    FOREIGN KEY (email) REFERENCES admin(email) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
);
DELIMITER //

DELIMITER $$

CREATE TRIGGER after_admin_insert
AFTER INSERT ON admin
FOR EACH ROW
BEGIN
    INSERT INTO admin_details (email) VALUES (NEW.email);
END $$

DELIMITER ;

SHOW TRIGGERS LIKE 'after_admin_insert';
SET SQL_SAFE_UPDATES = 0;
UPDATE admin 
SET password = '$2b$10$5sZLeOZTMHXsrNAU1w5k3ebKC.fkOm7sCzO977Xl1OATIplwm7dWC' 
WHERE email = 'abc@gmail.com';

INSERT INTO admin (email, password) VALUES ('admin@example.com', '1234');
INSERT INTO admin (email, password) VALUES ('pqr@example.com', '00998');
INSERT INTO admin (email, password) VALUES ('xyz@example.com', '231789');
INSERT INTO admin (email, password) VALUES ('shinde@example.com', '123456');
INSERT INTO admin (email, password) VALUES ('singh@example.com', '907645');

INSERT INTO category (name) VALUES ('Accounts');
INSERT INTO category (name) VALUES ('Sales');
INSERT INTO category (name) VALUES ('Entertainment');
INSERT INTO category (name) VALUES ('Production');
INSERT INTO category (name) VALUES ('Supply');


INSERT INTO employee (name,email, password,salary,address,image,category_id) VALUES ('bee','bee@example.com', '1234',100000,'Nerul','image_1696924863111.jpg',2);
INSERT INTO employee (name,email, password,salary,address,image,category_id) VALUES ('Newton','newton@example.com', '009904',30000,'Kharghar','image_1696949007650.jpg',6);
INSERT INTO employee (name,email, password,salary,address,image,category_id) VALUES ('Aishwarya','aish@example.com', '067234',108900,'Nahur','image_1696924863111.jpg',4);
INSERT INTO employee (name,email, password,salary,address,image,category_id) VALUES ('Patil','patil@example.com', '198734',1000,'CSMT','image_1696924863111.jpg',1);
INSERT INTO employee (name,email, password,salary,address,image,category_id) VALUES ('Aalia','Aalia@example.com', '15674',210000,'Chembur','image_1696949007650.jpg',3);

INSERT INTO admin_details (email, name, category_id, address, image, salary) 
VALUES ('radheya@gmail.com', 'Radheya', 4, 'Kharghar', 'image_1696949007650.jpg', 75000.00);
INSERT INTO admin_details (email, name, category_id, address, image, salary) 
VALUES ('pqr@example.com', 'Priya Bapat', 7, 'Dombivli', 'image_1696949007650.jpg', 95000.00);
INSERT INTO admin_details (email, name, category_id, address, image, salary) 
VALUES ('xyz@example.com', 'Shruti Marathe', 5, 'Bhandup', 'image_1696949007650.jpg', 80000.00);
INSERT INTO admin_details (email, name, category_id, address, image, salary) 
VALUES ('shinde@example.com', 'Dsouza', 1, 'CSMT', 'image_1696949007650.jpg', 90000.00);
INSERT INTO admin_details (email, name, category_id, address, image, salary) 
VALUES ('singh@example.com', 'Archana', 2, 'Vashi', 'image_1696949007650.jpg', 63000.00);


SELECT id, email, password FROM admin WHERE email = 'abc@gmail.com';
SELECT * FROM category;
SELECT * FROM employee;
SELECT * FROM admin;
SELECT * FROM attendance;
DESC admin;
DESC category;
DESC employee;
SELECT * FROM admin WHERE id = 1237;
DELETE FROM admin WHERE id = 1237;
SELECT * FROM admin_details;
SELECT * FROM admin WHERE email = 'abc@gmail.com';
SELECT * FROM admin WHERE id = '1258';

SELECT e.id, e.name, e.email, e.salary, c.name AS category_name 
FROM employee e
LEFT JOIN category c ON e.category_id = c.id;

SELECT c.name AS category_name, COUNT(e.id) AS total_employees 
FROM category c
LEFT JOIN employee e ON c.id = e.category_id
GROUP BY c.id;

SELECT a.id, a.email, ad.name, c.name AS category_name, ad.salary 
FROM admin a
LEFT JOIN admin_details ad ON a.email = ad.email
LEFT JOIN category c ON ad.category_id = c.id;

SELECT * FROM employee WHERE salary > 50000;

SELECT a.id, e.name, a.date, a.status 
FROM attendance a
JOIN employee e ON a.employee_id = e.id
WHERE e.email = 'bee@example.com';

SELECT * FROM employee WHERE category_id IS NULL;

SELECT * FROM employee ORDER BY salary DESC LIMIT 1;

DELETE FROM employee WHERE email = 'newton@example.com';

SELECT COUNT(*) AS total_employees FROM employee;

SELECT status, COUNT(*) AS count 
FROM attendance 
GROUP BY status 
ORDER BY count DESC 
LIMIT 1;

SELECT * FROM admin_details WHERE category_id IS NULL;

UPDATE employee SET salary = 120000 WHERE email = 'bee@example.com';

SELECT e.id, e.name, e.email, e.salary 
FROM employee e
JOIN category c ON e.category_id = c.id
WHERE c.name = 'IT';

SELECT * FROM employee ORDER BY salary DESC;

SELECT * FROM admin_details WHERE salary > 80000;

SELECT salary, COUNT(*) AS employee_count
FROM employee
GROUP BY salary
HAVING COUNT(*) > 1;

SELECT * FROM employee WHERE name LIKE '%A%';

SELECT c.name AS category_name, COUNT(e.id) AS total_employees 
FROM category c
LEFT JOIN employee e ON c.id = e.category_id
GROUP BY c.id
ORDER BY total_employees DESC
LIMIT 1;

SELECT DISTINCT email FROM employee;

SELECT COUNT(*) AS total_admins FROM admin;
