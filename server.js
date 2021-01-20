const inputCheck = require('./utils/inputCheck');
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

// set up express connection...
const express = require('express');
//const { param } = require('../zookeepr/routess/apiRoutes');

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

// Get all candidates 
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    // data base call 
    //We use the all() method from the database object to retrieve all the rows in the database
    db.all(sql, params, (err, rows)=> {
        if (err) {
            res.status(500).json({error: err.message});
            // empty return to exit out of function
            return;
        }
        // instead of logging the result, rows, from the database, we'll send this response as a JSON object to the browser, using res in the Express.js route callback
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// ------- Create Query to read single candidate using .get() method ----- //

// Get single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates 
                 WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: row
      });
    });
  });

// ----- create query for delete operation using run() method ---- //
// the squlite run() method will execute an SQL query but won't retrieve any data result

// Delete a candidate 
// The question mark (?) denotes a placeholder, making this a prepared statement. Prepared statements can have placeholders that can be filled in dynamically with real values at runtime.

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
  
      res.json({
        message: 'successfully deleted',
        //this refers to the database? scoped in the function? When using arrow functions its scoped one above/globally?
        changes: this.changes
      });
    });
  });

// // Create a candidate 

// {body} is just the destructored form of req.body (we are just pulling the body property out of the request obj)
//Until now, we've been passing the entire request object to the routes in the req parameter


    // validate the user data 
    //If the inputCheck() function returns an error, an error message is returned to the client as a 400 status code, to prompt for a different user request with a JSON object that contains the reasons for the errors. In order to use this function, we must import the module first. Place the following import statement near the top of the server.js file:


// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
  
    const sql =  `INSERT INTO candidates (first_name, last_name, industry_connected) 
                  VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    // ES5 function, not arrow function, to use this
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: body,
        id: this.lastID
      });
    });
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
