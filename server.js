const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./lib/connection');
const getDepartments = require('./lib/getDepartments');
const getRoles = require('./lib/getRoles');
const getEmployees = require('./lib/getEmployees');
const addDepartment = require('./lib/addDepartment');
const addRole = require('./lib/addRole');
const addEmployee = require('./lib/addEmployee');
const updateEmployeeRole = require('./lib/updateEmployeeRole');

const PORT = process.env.PORT || 3215;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  app.listen(PORT, () => {});
});

init = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments', 
                    'View All Roles',
                    'View All Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update Employee Role'
                ]
            }
        ])
        .then(answer => {
            switch (answer.action) {
                case 'View All Departments':
                    getDepartments()
                        .then(departments => console.table(departments))
                        .then(() => askAgain())
                        .catch((err) => console.log(err));
                    break;

                case 'View All Roles':
                    getRoles()
                        .then(roles => console.table(roles))
                        .then(() => askAgain())
                        .catch((err) => console.log(err));
                    break;

                case 'View All Employees':
                    getEmployees()
                        .then(employees => console.table(employees))
                        .then(() => askAgain())
                        .catch((err) => console.log(err));
                    break;

                case 'Add a Department':
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'department',
                                message: 'What department would you like to add?'
                            }
                        ])
                        .then(answer => addDepartment(answer.department))
                        .then(() => askAgain())
                        .catch((err) => console.log(err));
                    break;

                case 'Add a Role':
                    let departments = [];
                    
                    getDepartments()
                        .then(results => {
                            for (i = 0; i < results.length; i++) {
                                departments.push(results[i].name);
                            }
                        })
                        .then(() => {
                            inquirer
                                .prompt([
                                    {
                                        type: 'input',
                                        name: 'role',
                                        message: 'What title do you want to add?'
                                    },
                                    {
                                        type: 'number',
                                        name: 'salary',
                                        message: 'What is the salary?'
                                    },
                                    {
                                        type: 'list',
                                        name: 'department',
                                        message: 'Please select a department for this new role.',
                                        choices: departments
                                    }
                                ])
                                .then(answers => {
                                    addRole(answers.role, answers.salary, answers.department)
                                        .then(() => askAgain());
                                })
                                .catch((err) => console.log(err));
                        });
                    break;
                
                case 'Add an Employee':
                    let employeeAdded = [];
                    let roleAdded = [];
                    
                    getEmployees()
                        .then(results => {
                            for (i = 0; i < results.length; i++) {
                            employeeAdded.push(results[i].first_name + ' ' + results[i].last_name);
                            }
                        })
                        .then(() => {
                            getRoles()
                                .then(results => {
                                    for (i = 0; i < results.length; i++) {
                                        roleAdded.push(results[i].title);
                                    }
                                });
                        })
                        .then(() => {
                            inquirer
                                .prompt([
                                    {
                                        type: 'input',
                                        name: 'first_name',
                                        message: "What is the new employee's first name?"
                                    },
                                    {
                                        type: 'input',
                                        name: 'last_name',
                                        message: "What is the new employee's last name?"
                                    },
                                    {
                                        type: 'list',
                                        name: 'title',
                                        message: "What is the new employee's title?",
                                        choices: roleAdded
                                    },
                                    {
                                        type: 'list',
                                        name: 'manager',
                                        message: "Who is the new employee's manager?",
                                        choices: employeeAdded
                                    }
                                ])
                                .then(answers => {
                                    addEmployee(answers.first_name, answers.last_name, answers.title, answers.manager)
                                        .then(() => {
                                            askAgain()
                                        })
                                        .catch((err) => console.log(err));
                                });
                        });
                    break;

                case 'Update Employee Role':
                    let updateEmployees = [];
                    let updateRoles = [];
                    
                    getEmployees()
                        .then(results => {
                            for (i = 0; i < results.length; i++) {
                                updateEmployees.push(results[i].first_name + ' ' + results[i].last_name);
                            }
                        })
                        .then(() => {
                            getRoles()
                                .then(results => {
                                    for (i = 0; i < results.length; i++) {
                                        updateRoles.push(results[i].title);
                                    }
                                })
                                .then(() => {
                                    inquirer
                                        .prompt([
                                            {
                                                type: 'list',
                                                name: 'employee',
                                                message: 'Please select an employee to update.',
                                                choices: updateEmployees
                                            },
                                            {
                                                type: 'list',
                                                name: 'role',
                                                message: 'Please select their new role.',
                                                choices: updateRoles
                                            }
                                        ])
                                        .then(answers => {
                                            updateEmployeeRole(answers.employee, answers.role)
                                            .then(() => askAgain())
                                            .catch((err) => console.log(err))
                                        });

                                });
                        });
                    break;
            }
    });
}

function askAgain() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'askAgain',
                message: 'Would you like to perform another task?',
                choices: ['Yes', 'No']
            }
        ]).then(answer => {
            if (answer.askAgain === 'Yes') {
                init();
            } else {
                console.log("Thank you for using the Employee DB Manager.");
                db.end()
            }
    });
}

init();