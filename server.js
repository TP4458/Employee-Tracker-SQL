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
    // switch (answer.options) {
    // case "View all departments":
    //     viewDepts();
    //     break;
    // case "View all employee roles":
    //     viewRoles();
    //     break;
    // case "View all employees":
    //     viewEmpl();
    //     break;
    // case "Add a new department":
    //     addDept();
    //     break;
    // case "Add a new role":
    //     addRole();
    //     break;
    // case "Add a new employee":
    //     addEmployee();
    //     break;
    // case "Update an employee role":
    //     updateEmpl();
    //     break;
    // }
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

// const addRole = async () => {
//     connection.promise().query("SELECT * FROM departments", (err, answer) => {
//         if (err) throw err ;
//         let deptsArray = []
//         answer.foreach((departments) => {deptsArray.push(departments.name);
//         });
//         inquirer.prompt([

//             {
//                 name: 'role',
//                 type: 'input',
//                 message: 'Enter title for the new role:',
//               },
//               {
//                 name: 'salary',
//                 type: 'input',
//                 message: 'Enter the salary of this new role:',
//               },
//               {
//                 name: "deptIName",
//                 type: "list",
//                 message: "Choose the department for this role:",
//                 choices: deptsArray
//             }

//         ])
//         .then((data) => {
//             let newRole = data.newRole;
//             let deptId;

//             response.forEach((departments) => {
//               if (data.deptName === departments.name) {deptId = departments.id;}
//             });

//             // let sql =   `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
//             // let crit = [createdRole, answer.salary, departmentId];

//             connection.promise().query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [newRole, data.salary, departmentId], (error) => {
//               if (error) throw error;

//               console.log(`New role added.`);
//               questions();
//             });
//       })
        
//     })

// }

addRole = () => {
    connection.query(`SELECT * FROM departments;`, (err, res) => {
        if (err) throw err;
        let department = res.map(departments => ({name: departments.name, value: departments.id }));
        inquirer.prompt([
            {
            name: 'title',
            type: 'input',
            message: 'What is the name of the role you want to add?'   
            },
            {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role you want to add?'   
            },
            {
            name: 'deptName',
            type: 'rawlist',
            message: 'Which department do you want to add the new role to?',
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
                console.log(`${response.title} successfully added to database!`);
                questions();
            })
        })
    })
};

const addEmpl = () => {
    
}

const updateEmpl = () => {

}