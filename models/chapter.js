const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const ChaptersSchema = new Schema ({
    courseId: { type: Schema.Types.ObjectId, ref: 'courses' },
    name: String,
    lessons: Array,
},
    { timestamps: true }
);

const Chapter = mongoose.model('chapters', ChaptersSchema);
module.exports = Chapter;