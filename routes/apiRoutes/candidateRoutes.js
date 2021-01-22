// these are module declarations... things that we need access to to write our routes logic
// we need access to express, the router object, inputcheck() function logic and the database information
const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');


// ----- SQLite Queries ------- // --- create queries useing SQLite methods()

//Once we have the sqlite3 interface working properly, we can incorporate these statements into the Express.js routes to create the API endpoints needed by the GitHub issue//

// return all the data in the candidates table... will return this in the terminal in json format
//In the following statement, the db object is using the all() method. This method runs the SQL query ('SELECT * FROM') and executes the callback with all the resulting rows that match the query.

//-------- creat Query to read all potential candidates using all() method -----//

// Get all candidates 
// originally app.get('/api/candidates')
router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                 AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id`;
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
// app.get('/api/candidate/:id')
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                 AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id
                 WHERE candidates.id = ?`;
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
// app.delete('/api/candidate/:id')
router.delete('/candidate/:id', (req, res) => {
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
// app.post('/api/candidate')
router.post('/candidate', ({ body }, res) => {
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

// update a candidate 
// app.put('/api/candidate/:id')
router.put('/candidate/:id', (req, res)=>{
  // inputCheck() forces any PUT request to /api/candidate/:id to include a party_id property
  const errors = inputCheck(req.body, 'party_id');

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE candidates SET party_id = ?
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];

  db.run(sql,params, function(err, result){
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: req.body,
      changes: this.changes
    });
  });
});

//Finally, export the router object
module.exports = router;