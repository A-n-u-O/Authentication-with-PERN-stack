// this file helps connect everything server with database
const Pool = require('pg').Pool //what allows us to configure our connection

const pool = new Pool({
    user: "postgres",
    password: "postgres-Superusr",
    host: "localhost",
    port: 5432,
    database:"blogplatform"
});

module.exports = pool;//to manipulate data inside the routes e.g updating, inputing, deleting

