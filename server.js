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
    }, 
);

connection.connect(async (err) => {
    if (err) throw err;
    console.log("connected to workforce_db database.");
    questions()
})


const questions = async () => {
    const answer = await inquirer.prompt([{
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
    switch (answer.options) {
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
        addEmpl();
        break;
    case "Update an employee role":
        updateEmpl();
        break;
    }
}

const roleChoice = async () => {
    const roleQuery = "SELECT id AS value,title FROM roles;";
    const roles = await connection.query(roleQuery);
    return roles[0];
}
const deptChoice = async () => {
    const deptQuery = "SELECT id AS value, name FROM departments;";
    const depts = await connection.query(deptQuery);
    return depts[0];
}
const empChoice = async () => {
    const empQuery = "SELECT id AS value, first_name, last_name FROM employees;";
    const emps = await connection.query(empQuery);
    return emps [0];

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
    connection.promise().query(query)
        console.table(roles);
        questions();
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
          type: 'input',
          name: "name",
          message: "New department name:"
        }
      ]);
      connection.query("INSERT INTO departments(name) VALUES(?)", answer.name);
      console.log(`New department added: ${answer.name}`);
      questions();
    } catch (err) {
      console.log(err);
      connection.end();
    }
  };
const addRole = () => {
    
}

const addEmpl = () => {
    
}

const updateEmpl = () => {

}