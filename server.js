
//import SQLite database 
//This statement sets the execution mode to verbose to produce messages in the terminal regarding the state of the runtime. This feature can help explain what the application is doing, specifically SQLite.
const sqlite3 = require('sqlite3').verbose();

// connect to database
//We created a new object, db. This instance was created with the election.db file. The callback function informs us if there's an error in the connection.
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }

    console.log('Connected to the election database.');
});

// set up express connection...
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();



// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 

// ----- SQLite Queries ------- // --- create queries useing SQLite methods()

//Once we have the sqlite3 interface working properly, we can incorporate these statements into the Express.js routes to create the API endpoints needed by the GitHub issue//

// return all the data in the candidates table... will return this in the terminal in json format
//In the following statement, the db object is using the all() method. This method runs the SQL query ('SELECT * FROM') and executes the callback with all the resulting rows that match the query.

//-------- creat Query to read all potential candidates using all() method -----//

// db.all(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
//   });

// ------- Create Query to read single candidate using .get() method ----- //

// db.get(`SELECT * FROM candidates WHERE id = 1`, (err, row)=> {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// })

// ----- create query for delete operation using run() method ---- //
// the squlite run() method will execute an SQL query but won't retrieve any data result

// Delete a candidate 
// The question mark (?) denotes a placeholder, making this a prepared statement. Prepared statements can have placeholders that can be filled in dynamically with real values at runtime.
// db.run(`DELETE FROM candidates WHERE id = ?`, 1, function(err, result) {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result, this, this.changes);
//   });

// ----- query for create a candidate ---- //
// Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];
// ES5 function, not arrow function, to use this
db.run(sql, params, function(err, result) {
  if (err) {
    console.log(err);
  }
  console.log(result, this.lastID);
});


//Default response for any other request(Not Found) Catch all
//this must go at the end of all routes otherwise it will cancel out all other routes
app.use((req, res)=> {
    res.status(404).end();
});


// start the express server on port 3001
// start server after the db connection 
    //To ensure that the Express.js server doesn't start before the connection to the database has been established, let's wrap the Express.js server connection located at the bottom of the server.js file in an event handler,
db.on('open', ()=>{
    app.listen(PORT, ()=> {
        console.log(`Server running on port ${PORT}`);
    });
});
