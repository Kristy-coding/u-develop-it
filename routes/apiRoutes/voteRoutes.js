// these are module declarations... things that we need access to to write our routes logic
// we need access to express, the router object, inputcheck() function logic and the database information
const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.post('/vote', ({body}, res)=>{
    // DATA validation
    const errors = inputCheck(body, 'voter_id', 'candidate_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }

    // Prepare statement 
    const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?,?)`;
    const params = [body.voter_id,body.candidate_id];

    //Execute 
    db.run(sql, params, function(err, result){
        if (err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body,
            // add an id to new vote
            id: this.lastID
        });
    });

});

router.get('/votes', (req, res)=> {
    const sql = `SELECT candidates.*, parties.name AS party_name, 
                COUNT (candidate_id) AS count FROM votes 
                LEFT JOIN candidates ON votes.candidate_id = candidates.id 
                LEFT JOIN parties ON candidates.party_id = parties.id 
                GROUP BY candidate_id
                ORDER BY count DESC`;
    const params = [];

    db.all(sql, params, (err, rows)=> {
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

module.exports = router;