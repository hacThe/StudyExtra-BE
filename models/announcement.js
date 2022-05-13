const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');


const AnnouncementSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        slug: { type: String, slug: 'title', unique: true },
    },
    { 
        timestamps: true,
        collection: 'announcement',
    }
);

mongoose.plugin(slug)


const Announcement = mongoose.model('announcement', AnnouncementSchema);
module.exports = Announcement;