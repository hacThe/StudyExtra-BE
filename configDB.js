const mongoose = require('mongoose');

const USER_NAME = "dbStudyExtra";
const PASSWORD = "5hYXc2yggqIO8H2B";
const URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.l8ecb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

module.exports = connectDB = async () => {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connecting to DB successfully');
    } catch(e) {
        console.log('ERROR' , e);
    }
}


