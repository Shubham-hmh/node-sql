const mysql =require("mysql");

const db =mysql.createPool({
    connectionLimit: 100,
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database          
 })


module.exports = {db};


