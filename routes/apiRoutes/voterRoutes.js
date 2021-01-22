// these are module declarations... things that we need access to to write our routes logic
// we need access to express, the router object, inputcheck() function logic and the database information
const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

//create a GET route for /voters. This route will perform a SELECT * FROM voters and return the rows on success or a 500 status if there were errors.

router.get('/voters', (req, res)=>{
    const sql = `SELECT * FROM voters ORDER BY last_name`;
    const params = [];

    db.all(sql, params, (err,rows)=> {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// get individual voter
router.get('/voter/:id', (req, res)=> {
    const sql = `SELECT * FROM voters WHERE id = ?`;
    const params = [req.params.id];

    db.get (sql, params, (err, row)=> {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//The end goal is to allow people to register through the app (a POST request), update their email address (a PUT request), and deactivate their account (a DELETE request).

//First, let's implement the POST request. Assuming the front end will send us the user's first name, last name, and email address, we can write the route to appear like the following code

// {body} is object destructoruing grom req.body
router.post('/voter', ({body}, res) => {

    // prevent blank records from being created
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');

    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }

    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
    const params = [body.first_name,body.last_name, body.email];

    db.run(sql, params, function(err, data){
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body,
            id: this.lastID
        });
    });
});

//build the PUT route so users can update their email address. Following best practices, this will require a combination of req.params (to capture who is being updated) and req.body (to capture what is being updated).

router.put('/voter/:id', (req, res)=> {
    // Data validation to make sure empty requests are going through
    const errors = inputCheck(req.body, 'email');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE voters SET email = ? WHERE id = ?`;
  const params =  [req.body.email, req.params.id];

  db.run (sql, params, function (err, data){
      if (err) {
          res.status(400).json({error: err.message});
          return;
      }
      res.json ({
          message: 'success',
          data: req.body,
          changes: this.changes
      });
  });
});

router.delete('/voter/:id', (req, res)=>{
    const sql = `DELETE FROM voters WHERE id= ?`;
    const params = [req.params.id];

    db.run(sql, params, function(err, result){
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'deleted',
            changes: this.changes
            
        });
    });
});




module.exports = router;