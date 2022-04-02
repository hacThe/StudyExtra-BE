const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const ExamSchema = new Schema ({
    _id:{
        examId: String,
    },
    name: String,
    view: Number,
    link: String,
},
    { timestamps: true }
);

const Exam = mongoose.model('exam', ExamSchema);
module.exports = Exam;