
// set up express connection...
const express = require('express');

// import db module
const db = require('./db/database');

const PORT = process.env.PORT || 3001;
const app = express();

//Remember that you don't have to specify index.js in the path (e.g., ./routes/apiRoutes/index.js). If the directory has an index.js file in it, Node.js will automatically look for it when requiring the directory.
const apiRoutes = require('./routes/apiRoutes');

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoputes middleware
//By adding the /api prefix here, we can remove it from the individual route expressions after we move them to their new home
app.use('/api',apiRoutes);

 

//Default response for any other request(Not Found) Catch all
//THIS MUST GO AT THE END OF ALL ROUTES!!! otherwise it will cancel out all other routes
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
