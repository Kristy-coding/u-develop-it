// set up express connection...

const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();



// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
 



//Default response for any other request(Not Found) Catch all
//this must go at the end of all routes otherwise it will cancel out all other routes
app.use((req, res)=> {
    res.status(404).end();
});


// start the express server on port 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});