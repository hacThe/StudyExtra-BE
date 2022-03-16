const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const NotificationSchema = new Schema ({
    userID: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,//
        required: true,
    },
    creator: String,//username người tạo thông báo
    fileUrl: String,
},
    { timestamps: true }
);

const Notification = mongoose.model('notification', NotificationSchema);
module.exports = Notification;