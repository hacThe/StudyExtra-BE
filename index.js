const express = require('express');
const app = express();
const PORT = 5000;
const route = require('./routers/index');
const connectDB = require('./configDB');
const morgan = require('morgan');
const cors = require('cors');
const bp = require('body-parser');

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

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
