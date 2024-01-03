// get the client
const mysql = require('mysql2');
const inquirer = require('inquirer');

class EmployeeDB {

    constructor() {
        // create the connection to database
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'employee_db',
            password: 'mikkalpass'
          });
    }

    getConnection() {
        return this.connection;
    }

    closeConnection() {
        this.connection.end();
    }

    getEmployees(withId = false, filter = null) {
        let sql = 'SELECT ';
        if (withId) sql += 'e.id, ';
        sql += `CONCAT(e.last_name, ', ', e.first_name) AS 'name', 
                r.title, 
                d.name AS 'department', 
                r.salary
                FROM employee e 
                INNER JOIN role r ON e.role_id = r.id
                INNER JOIN department d ON r.department_id = d.id`;
        if (filter) sql += ` WHERE ${filter}`;
        sql += ` ORDER BY e.last_name ASC`;
        return this.connection.promise().query(sql);
    }

    getRoles(withId = false, filter = null) {
        let sql = 'SELECT ';
        if (withId) sql += 'r.id, ';
        sql += `r.title, 
                d.name AS 'department', 
                r.salary
                FROM role r 
                INNER JOIN department d ON r.department_id = d.id`
        if (filter) sql += ` WHERE ${filter}`;
        sql += ` ORDER BY r.title ASC`;
        return this.connection.promise().query(sql)
    }

    getDepartments(withId = false) {
        let sql = 'SELECT ';
        if (withId) sql += 'd.id, ';
        sql += `d.name AS 'department'
                FROM department d
                ORDER BY d.name ASC`;
        return this.connection.promise().query(sql);
    }

    addDepartment(name) {
        let sql = `INSERT INTO department (name) VALUES (?)`;
        return this.connection.promise().query(sql, name);
    }

    addRole(title, salary, dept_id) {
        let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        return this.connection.promise().query(sql, [title, salary, dept_id])
    }

    addEmployee(first_name, last_name, role_id, manager_id) {
        let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        return this.connection.promise().query(sql, [first_name, last_name, role_id, manager_id])
    }

    updateEmployeeRole(employee_id, role_id) {
        let sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        return this.connection.promise().query(sql, [role_id, employee_id])
    }

    updateEmployeeManager(employee_id, manager_id) {
        let sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
        return this.connection.promise().query(sql, [manager_id, employee_id])
    }

    getEmployeesByManager(manager_id) {
        let sql = `SELECT CONCAT(e.last_name, ', ', e.first_name) AS 'name'
                    FROM employee e
                    WHERE e.manager_id = ?
                    ORDER BY e.last_name ASC`;
        return this.connection.promise().query(sql, manager_id);
    }

    getEmployeesByDepartment(dept_id) {
        let sql = `SELECT CONCAT(e.last_name, ', ', e.first_name) AS 'name'
                    FROM employee e
                    INNER JOIN role r ON e.role_id = r.id
                    WHERE r.department_id = ?
                    ORDER BY e.last_name ASC`;
        return this.connection.promise().query(sql, dept_id);
    }

    deleteDepartment(dept_id) {
        let sql = `DELETE FROM department WHERE id = ?`;
        return this.connection.promise().query(sql, dept_id);
    }

    deleteRole(role_id) {
        let sql = `DELETE FROM role WHERE id = ?`;
        return this.connection.promise().query(sql, role_id);
    }

    deleteEmployee(employee_id) {
        let sql = `DELETE FROM employee WHERE id = ?`;
        return this.connection.promise().query(sql, employee_id);
    }

    getDepartmentBudget(dept_id) {
        let sql = `SELECT SUM(r.salary) AS 'budget'
                    FROM employee e
                    INNER JOIN role r ON e.role_id = r.id
                    WHERE r.department_id = ?`;
        return this.connection.promise().query(sql, dept_id);
    }
}


module.exports = EmployeeDB;