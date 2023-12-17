INSERT INTO departments (name) VALUES
("Production"),
("Analytical"),
("R&D"),
("Sales");

INSERT INTO roles(title, salary, department_id) VALUES
("Production Technician", 25500, 1),
("Production Manager", 35000, 1),
("Laboratory Analyst", 31000, 2),
("Laboratory Manager", 37000, 2),
("Scientist",48000, 3),
("Lead scientist", 59000, 3),
("Sales Lead", 85000, 4),
("Sales Executive", 61000, 4);

INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES
("Dolly", "Branican", 1, NULL),
("Helena", "Campbell", 1, 1),
("Phileas", "Fogg", 1, 1),
("Cornelia", "Casabel", 1, 1),
("Michael", "Ardan", 2, NULL),
("Pierre", "Axonnax", 3, 5),
("Cesar", "Casabel", 3, 5),
("Feofar", "Khan", 3, 5),
("Thomas", "Roch", 3, NULL),
("Jaques", "Paganel", 4, 9),
("James", "Starr", 5, 9),
("Ivan", "Ogareff", 5, NULL),
("John", "Hatteras", 6, 12),
("Ned", "Land", 7, NULL),
("Alcide", "Jolivet", 8, 14);