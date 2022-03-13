const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const CoursesSchema = new Schema ({
    _id:{
        courseID: String,
    },
    name: String,
    description: String,
    content: Array,
    price: Number,
    imgUrl: String,
    chapter: Array,
    categogy: String,
    rating: Array,
    studentId: Array,
},
    { timestamps: true }
);

const Course = mongoose.model('courses', CoursesSchema);
module.exports = Course;