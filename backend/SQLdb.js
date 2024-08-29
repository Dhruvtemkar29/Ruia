const { createConnection } = require("mysql2");

const connection = createConnection({
    host:"localhost",
    user:"root",
    password:"D@rshan",
    database:"ruia"
})

module.exports = connection;