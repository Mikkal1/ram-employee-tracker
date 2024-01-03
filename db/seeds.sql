-- DEPARTMENTS -----
INSERT INTO department (name)
VALUE ("IT");
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Marketing");

-- EMPLOYEE ROLES -------
INSERT INTO role (title, salary, department_id)
VALUE ("Senior Software Engineer", 300000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 275000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Senior Developer", 250000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Developer", 225000, 1);

INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 100000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 2);

INSERT INTO role (title, salary, department_id)
VALUE ("Marketing Lead", 190000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Marketing Staff", 150000, 3);

-- EMPLOYEE SEEDS, use superhero names -------
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Bruce", "Wayne", 1, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Clark", "Kent", 1, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Diana", "Prince", 1, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Barry", "Allen", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Peter", "Parker", 1, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Tony", "Stark", 1, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Steve", "Rogers", 1, 7);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Natasha", "Romanoff", 1, 8);
