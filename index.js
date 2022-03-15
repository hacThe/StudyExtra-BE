const express = require('express');
const app = express();
const route = require('./routers/index');
const connectDB = require('./configDB');
const morgan = require('morgan');
const cors = require('cors');
const bp = require('body-parser');
require("dotenv").config();

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use(morgan('combined'));
app.use(cors()); 

//connect mongoDB
connectDB();

// pass app into router
route(app);


//app listen
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
})
