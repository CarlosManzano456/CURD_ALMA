const mysql = require("mysql2");


class Crud{
    constructor(){
        this.conexion = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_NAME,
            port: process.env.MYSQL_PORT
        });

        this.conexion.connect(function(err) {
            if (err) {
                console.error('Error de conexión:', err);
                return;
            }
        });

        this.conexion.connect();

        return this.conexion;
    }
}

module.exports = Crud;