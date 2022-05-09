const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    announcementId: String,
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    slug: String
},
    { timestamps: true }
);


const Announcement = mongoose.model('announcement', AnnouncementSchema);
module.exports = Announcement;