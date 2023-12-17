const express = require("express");
const { default: inquirer } = require("inquirer");
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
        ],
    }])
}



const viewDepts = () => {

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