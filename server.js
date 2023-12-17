const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: "localhost", 
        user: "root",
        password: "",
        database: "workforce_db"
    }, 
    console.log("connected to workforce_db database.")
)

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
        console.log("er")
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

questions()

const viewDepts = () => {
    console.log("test")
}

const viewRoles = () => {
    
}

const viewEmpl = () => {
    
}

const addDept = () => {
    
}

const addRole = () => {
    
}

const addEmpl = () => {
    
}

const updateEmpl = () => {

}