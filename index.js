const express = require('express');
const app = express();
const PORT = 5000;
const route = require('./routers/index');
const connectDB = require('./configDB');
const morgan = require('morgan');
const cors = require('cors');
require("dotenv").config();
app.use(morgan('combined'));
app.use(cors()); 

//connect mongoDB
connectDB();

// pass app into router
route(app);


console.log(process.env.JWT_SECRET);


//app listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
})
