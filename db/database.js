//import SQLite database 
//This statement sets the execution mode to verbose to produce messages in the terminal regarding the state of the runtime. This feature can help explain what the application is doing, specifically SQLite.
const sqlite3 = require('sqlite3').verbose();

// connect to database
//We created a new object, db. This instance was created with the election.db file. The callback function informs us if there's an error in the connection.
//The sqlite3.Database() returns a Database object and opens the database connection automatically. When you create this object you get access to it's methods (.all(), run(), get()etc.)
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }

    console.log('Connected to the election database.');
});

module.exports = db;