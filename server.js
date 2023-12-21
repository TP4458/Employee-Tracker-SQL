const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");
// const connection = require("mysql2/typings/mysql/lib/Connection");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const connection = mysql.createConnection(
    {
        host: "localhost", 
        user: "root",
        password: "",
        database: "workforce_db"
    }
);

connection.connect( (err) => {
    if (err) throw err;
    console.log("connected to workforce_db database.");
    questions()
})


const questions = () => {
    try{
        inquirer.prompt([{
        type: "list", 
        name: "options",
        message: "select your option:",
        choices: [
            "View data",
            "Add new data",
            "Update employee\'s data:",
            "<EXIT>"
        ]
    }])
    .then((answers) => {
        switch (answers.options) {
    case "View data":
        viewData();
        break;
    case "Add new data":
        addData();
        break;
    case "Update employee\'s data:":
        updateEmpl();
        break;
    case "<EXIT>":
        connection.end();
        break;
    }
    })
    }  catch (err) {
       console.log(err);
  }
}

const viewData = () => {
    try{
        inquirer.prompt([{
            type: "list",
            name: "options",
            message: "Select which data to view:",
            choices: [
                "View all departments",
                "View all employee roles",
                "View all employees",
                "<-Back"
            ]
        }])
        .then((answers) => {
            switch (answers.options) {
                case "View all departments":
                    viewDepts();
                    break;
                case "View all employee roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmpl();
                    break;
                case "<-Back":
                    questions();
                    break; 
            }
        }) 
    }   catch (err) {
        console.log(err);
      }
}
const addData = () => {
    try{
        inquirer.prompt([{
            type: "list",
            name: "options",
            message: "Select which data to add:",
            choices: [
                "Add a new department",
                "Add a new employee roles",
                "Add a new employee",
                "<-Back"
            ]
        }])
        .then((answers) => {
            switch (answers.options) {
                case "Add a new department":
                    addDept();
                    break;
                case "Add a new employee roles":
                    addRole();
                    break;
                case "Add a new employee":
                    addEmployee();
                    break; 
                case "<-Back":
                    questions();
                    break;
            }
        }) 
    }   catch (err) {
        console.log(err);
      }
}

const updateEmpl = () => {
    try {
        inquirer.prompt([{
            type: "list", 
            name: "options",
            message: "select your option:",
            choices: [
                "Change employee\'s name",
                "Change employee\'s role",
                "Change employee\'s manager",
                "<-Back"
            ]
        }])
            .then((answers) => {
                switch (answers.options) {
            case "Change employee\'s name":
                updateEmplName();
                break;
            case "Change employee\'s role":
                updateEmplRole();
                break;
            case "Change employee\'s manager":
                updateEmplManager();
                break;
            case "<-Back":
                questions();
                break;
            }
            })       
    }   catch (err) {
        console.log(err);
      }
}

const viewDepts =  () => {
    const query ="SELECT * FROM departments";
    connection.query(query, (err, departments) => {
        if (err) throw err;
        console.table(departments);
        viewData();
    })
}

const viewRoles =  () => {
    const query ="SELECT * FROM roles";
    connection.query(query, (err, roles) => {
    connection.promise().query(query)
        console.table(roles);
        viewData();
    })
}


const viewEmpl =  () => {
    const query ="SELECT * FROM employees";
    connection.query(query, (err, employees) => {
        if (err) throw err;
        console.table(employees);
        viewData();
    })
}

const addDept = async () => {
    // connection.query
    try {
      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "New department name:"
        }
      ]);
      connection.query("INSERT INTO departments (name) VALUES (?)", answer.name);
      console.log(`New department added: ${answer.name}`);
      addData();
    } catch (err) {
      console.log(err);
      connection.end();
    }
  };

const addRole = () => {
    connection.query("SELECT * FROM departments;", (err, data) => {
        if (err) throw err;
        let department = data.map(departments => ({
              name: departments.name,
              value: departments.id
            }
        ));
        inquirer.prompt([
            {
            name: 'title',
            type: 'input',
            message: 'New role name:'   
            },
            {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for new role:'   
            },
            {
            name: 'deptName',
            type: 'rawlist',
            message: 'Select the department for the new role:',
            choices: department
            },
        ]).then((response) => {
            connection.query(`INSERT INTO roles SET ?`, 
            {
                title: response.title,
                salary: response.salary,
                department_id: response.deptName,
            },
            (err) => {
                if (err) throw err;
                console.log(`${response.title} has been added to the database!`);
                addData();
            })
        })
    })
};

const addEmployee = () => {
    connection.query("SELECT * FROM roles", (err, data) => {
        if (err) throw err;
        let role = data.map(roles => (
            {
                name: roles.title, 
                value: roles.id
            }
        ));
        connection.query("SELECT * FROM employees", (err, data) => {
            if (err) throw err;
            let managers = data.map(employees => (
                {
                    name: employees.first_name + " " + employees.last_name,
                    value: employees.id
                }
            ));
            inquirer.prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "Enter new employee\'s first name:"
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "Enter new employee\'s last name:"
                },
                {
                    name: "role",
                    type: "rawlist",
                    message: "Select the new employee\'s role:",
                    choices: role
                },
                {
                    name: "manager",
                    type: "rawlist",
                    message: "Select a manager for the new employee:",
                    choices: managers
                }
            ])
            .then ((answer) => {
                connection.query("INSERT INTO employees SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.role,
                    manager_id: answer.manager
                },
                (err) => {
                    if (err) throw err;
                    console.log(`${answer.firstName} ${answer.lastName} has been added to the database.`)
                    addData()
                })
                
            })
        })
    })
}



const updateEmplManager = () => {
    connection.query("SELECT * FROM employees", (err, data) => {
        if (err) throw err;
        let employee = data.map(employees => (
            {
                name: employees.first_name + " " + employees.last_name,
                value: employees.id
            }
        ));
        inquirer.prompt([
            {
                name: "employee",
                type: "rawlist",
                message: "Select an employee to update the manager for:",
                choices: employee
            },
            {
                name: "manager",
                type: "rawlist",
                message: "Select a new manager for this employee:",
                choices: employee
            }
        ])
        .then((answer) => {
            connection.query("UPDATE employees SET ? WHERE ?",
            [
                {
                    manager_id: answer.manager
                },
                {
                    id: answer.employee
                }
            ],
                (err) => {
                if (err) throw err;
                console.log(`${answer.firstName} ${answer.lastName} has been added to the database.`)
                questions()
        })
        }) 
    }
    )
}

const updateEmplRole = () => {
    connection.query("SELECT * FROM roles", (err, data) => {
        if (err) throw err;
        let role = data.map(roles => (
            {
                name: roles.title, 
                value: roles.id
            }
        ));
        connection.query("SELECT * FROM employees", (err, data) => {
            if (err) throw err;
            let employee = data.map(employees => (
                {
                    name: employees.first_name + " " + employees.last_name,
                    value: employees.id
                }
            ));
            inquirer.prompt([
                {
                    name: "employee",
                    type: "rawlist",
                    message: "Select an employee to update the role for:",
                    choices: employee
                },
                {
                    name: "role",
                    type: "rawlist",
                    message: "Select a new role for this employee:",
                    choices: role                
                }
            ])
            .then ((answer) => {
                connection.query("UPDATE employees SET ? WHERE ?",
                [
                    {
                        role_id: answer.role
                    },
                    {
                        id: answer.employee
                    }
                ],
                (err) => {
                    if (err) throw err;
                    console.log(`Employee\'s role succesfuly updated to ${answer.role}.`)
                    updateEmpl();
                }
                )
            })
          })
    })
    
}
const updateEmplName = () => {
    connection.query("SELECT * FROM employees", (err, data) => {
        if (err) throw err;
        let employee = data.map(employees => (
            {
                name: employees.first_name + " " + employees.last_name,
                value: employees.id
            }
        ));
        inquirer.prompt([
            {
                name: "employee",
                type: "rawlist",
                message: "Select an employee to update the name for:",
                choices: employee
            },
            {
                name: "firstName",
                type: "input",
                message: "Enter employee\'s first name:"
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter employee\'s last name:"
            }
        ])
        .then((answer) => {
            connection.query("UPDATE employees SET ?,? WHERE ?",
            [
                {
                    first_name: answer.firstName
                },
                {
                    last_name: answer.lastName
                },
                {
                    id: answer.employee
                }
            ],
                (err) => {
                if (err) throw err;
                console.log(`Data for ${answer.firstName} ${answer.lastName} has been succesfully updated.`)
                updateEmpl()
        })
        }) 
    }
    )
}
