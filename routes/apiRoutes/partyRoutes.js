
// these are module declarations... things that we need access to to write our routes logic
// we need access to express, the router object and the database information
const express = require('express');
const router = express.Router();
const db = require('../../db/database')

// get all parties
// originally app.get('/api/parties')
router.get('/parties', (req, res)=>{
    const sql = `SELECT * FROM parties`;
    const params = [];
    db.all(sql,params, (err, rows)=>{
      if(err){
        res.status(500).json({error: err.message});
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });
  
  // get single party
  //originally app.get('/api/party/:id'
  router.get('/party/:id', (req, res)=> {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row)=>{
      if(err) {
        res.status(400).json({error: err.message});
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
  });
  
  //Delete a party
  // originally app.delete('/api/party/:id'
  router.delete('/party/:id', (req, res)=>{
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({error: res.message});
        return;
      }
      res.json({ message:'successfully deleted', changes:this.changes});
    });
  });

  module.exports = router;
