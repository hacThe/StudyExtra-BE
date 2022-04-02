const express = require('express');
const app = express();
const axios = require('axios')
// Test socket


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

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        allowedHeaders: ["origin, x-requested-with, content-type"],
        credentials: true
    }
})
//connect mongoDB
connectDB();

// pass app into router
route(app);

//Socket
io.on('connection', (socket) => {
    console.log('user connect' + socket.id);
    //Bắt sự kiện từ client
    socket.on('on-chat', data => {
        console.log(data)
        io.emit('user-chat', data)
    })

    socket.on('send-to-user', data => {
        console.log(data);
        io.emit(`user-${data.nameTo}`, data) 
    })  
    //Truyển ID socket về client
    socket.emit("me", socket.id)


    // Bắt sự kiện disconnect
    socket.on('disconnect', () =>{
        console.log(socket.id + ' disconnect')
        socket.broadcast.emit("callEnded")
    })

    
    //Gọi api
    axios.get(`https://jsonplaceholder.typicode.com/posts`)
    .then(res => {
        console.log("Thành công")
    }).catch(err => {
        console(err)
    })

    //
    
})

//app listen
http.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
})
