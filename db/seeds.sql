INSERT INTO department (name)
    VALUES
        ('Marketing'),
        ('Manufacturing'),
        ('Distribution');;

INSERT INTO role (title, salary, department_id)
    VALUES
        ('Marketing Manager', 130000, 1),
        ('Marketing Associate', 120000, 1),
        ('Manufacturing Manager', 110000, 2),
        ('Manufacturing Designer', 111000, 2),
        ('Distribution Manager', 90000, 3),
        ('Distribution Analyst', 85000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES
        ('John', 'Doe', 1, NULL),
        ('Jake', 'Main', 2, 1),
        ('Nicholas', 'Traorie', 3, NULL),
        ('Thomas', 'Trim', 4, 3),
        ('Pieck', 'Chin', 5, NULL),
        ('Jennefer', 'Slimm', 6, 5);