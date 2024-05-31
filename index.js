const inquirer = require ('inquirer')
const db = require('./config/connection')
const cTable = require('console.table')

function start () {
    inquirer
    .prompt(
        {
            type: "list",
            name: "choices",
            message: "What course of action would you like to take?",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add a Role", "View All Departments", "Add a Department"]
        }
    )
    .then((selected) => {
        const { choices } = selected;
        if (choices == "View All Employees") {
            console.log("selected view");
            viewEmployees(); 
        } else if (choices == "Add Employee") {
            addEmployee();
        } else if (choices == "Update Employee Role") {
            updateRole();
        } else if (choices == "View All Roles") {
            console.log("selected view");
            viewRoles(); 
        } else if (choices == "Add a Role") {
            addRole();
        } else if (choices == "View All Departments") {
            viewDept();
        } else if (choices == "Add a Department") 
            addDept();
    });
};


function viewEmployees() {
    db.query('SELECT * FROM employee', function (err, data) {
        if (err) {
            console.log(err);
        } else {
        console.table(data.rows)
        }
        start();
    })
};

function addEmployee() {
    db.query("SELECT id, title FROM roles;", function (err, rolesResult) {
        if (err) {
            console.log(err);
            return;
        }

        db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee;", function (err, managersResult) {
            if (err) {
                console.log(err);
                return;
            }

            let roles = rolesResult.rows.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            let managers = managersResult.rows.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            inquirer.prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "What is the first name of the Employee?"
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the last name of the Employee?"
                },
                {
                    type: "list",
                    name: "roleId",
                    message: "What is the Role for this Employee?",
                    choices: roles
                },
                {
                    type: "list",
                    name: "managerId",
                    message: "Who is the Manager for this Employee?",
                    choices: managers
                }

            ]).then(data => {
                console.log('Inserting values:', data.firstName, data.lastName, data.roleId, data.managerId);
                console.log('SQL Query:', 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);');
                console.log('Values:', data.firstName, data.lastName, data.roleId, data.managerId);
                db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);', [data.firstName, data.lastName, data.roleId, data.managerId],
                    function (err, result) {
                        if (err) {
                            return console.log('Error adding employee', err);
                        }
                        console.log('Employee added successfully.', result);
                        start();
                    });
            });
        });
    });
}

function updateRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "updateEmployeeRole",  
            message: "What employee id do you want to update?"
        },
        {
            type: "input",
            name: "employeeRole",
            message: "What is their new role id?"
        }
    ]).then((response) => {
        db.query('UPDATE employee SET role_id = $1 WHERE id = $2;', [response.employeeRole, response.updateEmployeeRole], function(error, data) {
        if(error) throw error;
        start()
    })
    })
};

function viewRoles() {
    db.query('SELECT * FROM roles', function (error, results) {
        if(error) {
            console.log(error);
        } else if (results)
        console.table(results.rows);
        start();
      }
    )};

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "roleName",
            message: "What is the name of the role you want to add?"
        },
        {
            type: "input",
            name: "roleSalary",
            message: "What is the salary for this role?"
        },
        {
            type: "input",
            name: "roleDept",
            message: "What is the department id for this role?"
        }
    ]).then((response) => {
        db.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3);', [response.roleName, response.roleSalary, response.roleDept], function(error, data) {
            if(error) throw error;
            start();
        })
    })

};

function viewDept() {
    db.query('SELECT * FROM department', function (error, results) {
        if(error) {
            console.log(error);
        } else if (results)
            console.table(results.rows);
        
        start();
    });
}



function addDept() {
    inquirer.prompt([
        {
            type: "input",
            name: "deptName",
            message: "What is the name of the department you want to add?"
        }
    ]).then((response) => {
        db.query('INSERT INTO department (department_name) VALUES ($1);', [response.deptName], function(error, data) {
            if(error) throw error;
            start()
        })
    })

};




start();
