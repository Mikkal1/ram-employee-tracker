//======== Dependencies===================//
const inquirer = require("inquirer")
const EmployeeDB = require("./db/dbconn");

// the Employee class
const db = new EmployeeDB();

db.getConnection().connect((error) => {
    if (error) throw error;
    console.log(`Welcome to the RAM Employee Tracker!`);
    mainPrompt();
});

// Prompt User for Choices
const mainPrompt = () => {
    inquirer.prompt([
        {
          name: 'choices',
          type: 'list',
          message: 'Please select an option:',
          choices: [
            'View All Employees',
            'View All Roles',
            'View All Departments',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'View Employees By Manager',
            'View Employees By Department',
            'Delete Department',
            'Delete Role',
            'Delete Employee',
            'View Department Budget',
            'Exit'
            ]
        }
      ])
      .then((answers) => {
        const {choices} = answers;
  
        if (choices === 'View All Employees') {
            viewAllEmployees();
        }
        else if (choices === 'View All Roles') {
            viewAllRoles();
        }
        else if (choices === 'View All Departments') {
            viewAllDepartments();
        }
        else if (choices === 'Add Department') {
            addDepartment();
        }
        else if (choices === 'Add Role') {
            addRole();
        }
        else if (choices === 'Add Employee') {
            addEmployee();
        }
        else if (choices === 'Update Employee Role') {
            updateEmployeeRole();
        }
        else if (choices === 'Update Employee Manager') {
            updateEmployeeManager();
        }
        else if (choices === 'View Employees By Manager') {
            viewEmployeesByManager();
        }
        else if (choices === 'View Employees By Department') {
            viewEmployeesByDepartment();
        }
        else if (choices === 'Delete Department') {
            deleteDepartment();
        }
        if (choices === 'Delete Role') {
            deleteRole();
        }
        else if (choices === 'Delete Employee') {
            deleteEmployee();
        }
        else if (choices === 'View Department Budget') {
            viewDepartmentBudget();
        }
        else if (choices === 'Exit') {
            db.closeConnection();
        }
    });
  };

const viewAllDepartments = () => {
    db.getDepartments()
        .then( ([rows,fields]) => {
            console.table(rows);
            mainPrompt();
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
};

const viewAllRoles = () => {
    db.getRoles()
        .then( ([rows,fields]) => {
            console.table(rows);
            mainPrompt();
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

const viewAllEmployees = () => {
    db.getEmployees()
        .then( ([rows,fields]) => {
            console.table(rows);
            mainPrompt();
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}
  
// Add a New Department
const addDepartment = () => {
    inquirer
        .prompt([
        {
            name: 'departmentName',
            type: 'input',
            message: 'What is the new department name?'
        }
        ])
        .then(({departmentName}) => {
            db.addDepartment(departmentName)
            .then( ([rows,fields]) => {
                console.log(departmentName + ` Department successfully created!`);
                mainPrompt();
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
        });
};


const addRole = () => {
    db.getDepartments(true)
        .then( ([rows,fields]) => {
            return rows;
        })
        .then(rows => {
            return rows.map(e => [e.id, e.department])
        })
        .then(rows => {
            dept_ids = rows.map(e => e[0]);
            departments = rows.map(e => e[1]);
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the title of the new role?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'How much is the salary?'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select a department:',
                    choices: departments
                }
            ])
            .then(answers => {
                let dept_id = dept_ids[departments.indexOf(answers.department)];
                // insert to database
                db.addRole(answers.title, answers.salary, dept_id)
                    .then(([rows, fields]) => {
                        console.log(`\n`);
                        console.log(`${answers.title} role successfully created for ${answers.department} department!`);
                        db.getRoles()
                        console.log(`\n`);
                        mainPrompt();
                    })
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
        });
}


const addEmployee = () => {
    db.getRoles(true)
        .then( ([rows,fields]) => {
            return rows;
        })
        .then(rows => {
            return rows.map(e => [e.id, e.title])
        })
        .then(rows => {
            role_ids = rows.map(e => e[0]);
            roles = rows.map(e => e[1]);
            db.getEmployees(true)
                .then( ([rows,fields]) => {
                    return rows;
                })
                .then(rows => {
                    return rows.map(e => [e.id, e.name])
                })
                .then(rows => {
                    manager_ids = rows.map(e => e[0]);
                    managers = rows.map(e => e[1]);
                    managers.push('None');
                    manager_ids.push(null);

                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'first_name',
                            message: `What is the db's first name?`
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: `What is the db's last name?`
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: `Select a role:`,
                            choices: roles
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: `Select a manager:`,
                            choices: managers
                        }
                    ])
                    .then(answers => {
                        let role_id = role_ids[roles.indexOf(answers.role)];
                        let manager_id = manager_ids[managers.indexOf(answers.manager)];
                        // insert to database
                        db.addEmployee(answers.first_name, answers.last_name, role_id, manager_id)
                            .then(([rows, fields]) => {
                                console.log(`\n`);
                                console.log(`${answers.first_name} ${answers.last_name} successfully added!`);
                                db.getEmployees()
                                console.log(`\n`);
                                mainPrompt();
                            })
                            .catch(error => {
                                console.log(error);
                                throw error;
                            });
                    })
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });
                });
        });
}


const updateEmployeeRole = () => {
    db.getEmployees(true)
        .then( ([rows,fields]) => {
            return rows;
        })
        .then(rows => {
            return rows.map(e => [e.id, e.name])
        })
        .then(rows => {
            employee_ids = rows.map(e => e[0]);
            employees = rows.map(e => e[1]);
            db.getRoles(true)
                .then( ([rows,fields]) => {
                    return rows;
                })
                .then(rows => {
                    return rows.map(e => [e.id, e.title])
                })
                .then(rows => {
                    role_ids = rows.map(e => e[0]);
                    roles = rows.map(e => e[1]);
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'db',
                            message: `Select an employee:`,
                            choices: employees
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: `Select a role:`,
                            choices: roles
                        }
                    ])
                    .then(answers => {
                        let role_id = role_ids[roles.indexOf(answers.role)];
                        let employee_id = employee_ids[employees.indexOf(answers.db)];
                        // insert to database
                        db.updateEmployeeRole(employee_id, role_id)
                            .then(([rows, fields]) => {
                                console.log(`\n`);
                                console.log(`${answers.db}'s role successfully updated to ${answers.role}!`);
                                db.getEmployees()
                                console.log(`\n`);
                                mainPrompt();
                            })
                            .catch(error => {
                                console.log(error);
                                throw error;
                            });
                    })
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });
                });
        });
}


const updateEmployeeManager = () => {
    db.getEmployees(true)
        .then( ([rows,fields]) => {
            return rows;
        })
        .then(rows => {
            return rows.map(e => [e.id, e.name])
        })
        .then(rows => {
            employee_ids = rows.map(e => e[0]);
            employees = rows.map(e => e[1]);
            manager_ids = employee_ids.slice();
            managers = employees.slice();
            managers.push('None');
            manager_ids.push(null);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'db',
                    message: `Select an employee:`,
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: `Select a manager:`,
                    choices: managers
                }
            ])
            .then(answers => {
                let manager_id = manager_ids[managers.indexOf(answers.manager)];
                let employee_id = employee_ids[employees.indexOf(answers.db)];
                // make sure the selected manager is not himself
                if (employee_id === manager_id) {
                    console.log('\nInvalid manager selection.\n')
                    mainPrompt();
                }
                else {
                    // update the database
                    db.updateEmployeeManager(employee_id, manager_id)
                        .then(([rows, fields]) => {
                            console.log(`\n`);
                            console.log(`${answers.db}'s manager successfully updated to ${answers.manager}!`);
                            db.getEmployees()
                            console.log(`\n`);
                            mainPrompt();
                        })
                        .catch(error => {
                            console.log(error);
                            throw error;
                        });
                }
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
        });
}


const viewEmployeesByManager = () => {
    db.getEmployees(true)
        .then( ([rows,fields]) => {
            return rows;
        })
        .then(rows => {
            return rows.map(e => [e.id, e.name])
        })
        .then(rows => {
            employee_ids = rows.map(e => e[0]);
            employees = rows.map(e => e[1]);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'manager',
                    message: `Select a manager:`,
                    choices: employees
                }
            ])
            .then(answers => {
                let manager_id = employee_ids[employees.indexOf(answers.manager)];
                db.getEmployeesByManager(manager_id)
                    .then(([rows, fields]) => {
                        console.log(`\n`);
                        console.log(`Employees managed by ${answers.manager}:`);
                        // count the number of returned rows
                        if (rows.length === 0) {
                            console.log('- None -');
                        }
                        else {
                            console.table(rows);
                        }
                        console.log(`\n`);
                        mainPrompt();
                    })
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
        });
}


const viewEmployeesByDepartment = () => {
    db.getDepartments(true)
        .then( ([rows,fields]) => {
            return rows;
        })
        .then(rows => {
            return rows.map(e => [e.id, e.department])
        })
        .then(rows => {
            dept_ids = rows.map(e => e[0]);
            departments = rows.map(e => e[1]);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: `Select a department:`,
                    choices: departments
                }
            ])
            .then(answers => {
                let dept_id = dept_ids[departments.indexOf(answers.department)];
                db.getEmployeesByDepartment(dept_id)
                    .then(([rows, fields]) => {
                        console.log(`\n`);
                        console.log(`Employees in ${answers.department} department:`);
                        // count the number of returned rows
                        if (rows.length === 0) {
                            console.log('- None -');
                        }
                        else {
                            console.table(rows);
                        }
                        console.log(`\n`);
                        mainPrompt();
                    })
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
        });
}


const deleteDepartment = () => {
    db.getDepartments(true)
        .then( ([rows,fields]) => {
            return rows;
        })
        .then(rows => {
            return rows.map(e => [e.id, e.department])
        })
        .then(rows => {
            dept_ids = rows.map(e => e[0]);
            departments = rows.map(e => e[1]);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: `Select a department to delete:`,
                    choices: departments
                }
            ])
            .then(answers => {
                let dept_id = dept_ids[departments.indexOf(answers.department)];
                // check if there are roles in the department
                db.getRoles(false, `department_id = ${dept_id}`)
                    .then( ([rows,fields]) => {
                        return rows;
                    })
                    .then(rows => {
                        return rows.map(e => [e.id, e.department_id])
                    })
                    .then(rows => {
                        if (rows.length > 0) {
                            console.log(`\n`);
                            console.log(`Cannot delete ${answers.department} department because it has roles assigned to it.`);
                            console.log(`\n`);
                            mainPrompt();
                        }
                        else {
                            // delete from database
                            db.deleteDepartment(dept_id)
                            .then(([rows, fields]) => {
                                console.log(`\n`);
                                console.log(`${answers.department} department successfully deleted!`);
                                db.getDepartments()
                                console.log(`\n`);
                                mainPrompt();
                            })
                            .catch(error => {
                                console.log(error);
                                throw error;
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
        });
}


const deleteRole = () => {
    db.getRoles(true)
        .then( ([rows,fields]) => {
            return rows;
        })
        .then(rows => {
            return rows.map(e => [e.id, e.title])
        })
        .then(rows => {
            role_ids = rows.map(e => e[0]);
            roles = rows.map(e => e[1]);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: `Select a role to delete:`,
                    choices: roles
                }
            ])
            .then(answers => {
                let role_id = role_ids[roles.indexOf(answers.role)];
                // check if there are employees in the role
                db.getEmployees(false, `role_id = ${role_id}`)
                    .then( ([rows,fields]) => {
                        return rows;
                    })
                    .then(rows => {
                        return rows.map(e => [e.id, e.role_id])
                    })
                    .then(rows => {
                        if (rows.length > 0) {
                            console.log(`\n`);
                            console.log(`Cannot delete ${answers.role} role because it has employees assigned to it.`);
                            console.log(`\n`);
                            mainPrompt();
                        }
                        else {
                            // delete from database
                            db.deleteRole(role_id)
                            .then(([rows, fields]) => {
                                console.log(`\n`);
                                console.log(`${answers.role} role successfully deleted!`);
                                db.getRoles()
                                console.log(`\n`);
                                mainPrompt();
                            })
                            .catch(error => {
                                console.log(error);
                                throw error;
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
        });
}


const deleteEmployee = () => {
    db.getEmployees(true)
        .then( ([rows,fields]) => {
            return rows;
        })
        .then(rows => {
            return rows.map(e => [e.id, e.name])
        })
        .then(rows => {
            employee_ids = rows.map(e => e[0]);
            employees = rows.map(e => e[1]);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'db',
                    message: `Select an employee to delete:`,
                    choices: employees
                }
            ])
            .then(answers => {
                let employee_id = employee_ids[employees.indexOf(answers.db)];
                // check if this employee manages other employees
                db.getEmployees(false, `manager_id = ${employee_id}`)
                    .then( ([rows,fields]) => {
                        return rows;
                    })
                    .then(rows => {
                        return rows.map(e => [e.id, e.manager_id])
                    })
                    .then(rows => {
                        if (rows.length > 0) {
                            console.log(`\n`);
                            console.log(`Cannot delete ${answers.db} because he/she manages other employees.`);
                            console.log(`\n`);
                            mainPrompt();
                        }
                        else {
                            // delete from database
                            db.deleteEmployee(employee_id)
                            .then(([rows, fields]) => {
                                console.log(`\n`);
                                console.log(`${answers.db} successfully deleted!`);
                                db.getEmployees()
                                console.log(`\n`);
                                mainPrompt();
                            })
                            .catch(error => {
                                console.log(error);
                                throw error;
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
        });
}


const viewDepartmentBudget = () => {
    db.getDepartments(true)
        .then( ([rows,fields]) => {
            return rows;
        })
        .then(rows => {
            return rows.map(e => [e.id, e.department])
        })
        .then(rows => {
            dept_ids = rows.map(e => e[0]);
            departments = rows.map(e => e[1]);
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: `Select a department:`,
                    choices: departments
                }
            ])
            .then(answers => {
                let dept_id = dept_ids[departments.indexOf(answers.department)];
                db.getDepartmentBudget(dept_id)
                    .then(([rows, fields]) => {
                        console.log(`\n`);
                        console.log(`Total utilized budget of ${answers.department} department:`);
                        // count the number of returned rows
                        if (rows.length === 0) {
                            console.log('- None -');
                        }
                        else {
                            // display budget in currency format
                            let budget = rows[0].budget;
                            budget = new Intl.NumberFormat().format(budget);
                            console.log(`$ ${budget}`);
                        }
                        console.log(`\n`);
                        mainPrompt();
                    })
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
        });
}