const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const ctable = require("console.table");
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
        inquirer.prompt([{
        type: "list", 
        name: "options",
        message: "select your option:",
        choices: [
            "View all departments",
            "View all employee roles",
            "View all employees",
            "Add a new department",
            "Add a new role",
            "Add a new employee",
            "Update an employee role"
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
    case "Add a new department":
        addDept();
        break;
    case "Add a new role":
        addRole();
        break;
    case "Add a new employee":
        addEmployee();
        break;
    case "Update an employee role":
        updateEmpl();
        break;
    }
    })
}


const viewDepts =  () => {
    const query ="SELECT * FROM departments";
    connection.query(query, (err, departments) => {
        if (err) throw err;
        console.table(departments);
        questions();
    })
}

const viewRoles =  () => {
    const query ="SELECT * FROM roles";
    connection.query(query, (err, roles) => {
    connection.promise().query(query)
        console.table(roles);
        questions();
    })
}


const viewEmpl =  () => {
    const query ="SELECT * FROM employees";
    connection.query(query, (err, employees) => {
        if (err) throw err;
        console.table(employees);
        questions();
    })
}

const addDept = async () => {
    try {
      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "New department name:"
        }
      ]);
      connection.query("INSERT INTO departments (name) VALUES (?)", answer.name);
      console.log("New department added: ${answer.name}");
      questions();
    } catch (err) {
      console.log(err);
      connection.end();
    }
  };

addRole = () => {
    connection.query(`SELECT * FROM departments;`, (err, data) => {
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
                questions();
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
                    questions()
                })
                
            })
        })
    })
    
}

const updateEmpl = () => {

}