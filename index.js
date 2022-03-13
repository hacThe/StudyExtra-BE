const express = require('express');
const app = express();
const PORT = 5000;
const route = require('./routers/index');
const connectDB = require('./configDB');
const morgan = require('morgan');
var cors = require('cors');

app.use(morgan('combined'));
app.use(cors()); 

//connect mongoDB
connectDB();

// pass app into router
route(app);


//app listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
