const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const ExamSchema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    courseID: String,
    typeID: Array,
    testCount: Number,
    description: String,
    time: Number,//phút
    detail: String,
    requirement: Array,
    questionsID: String,
    attempt: Number
},
    { timestamps: true }
);

const QuestionsSchema = new Schema({
    ListQuestions: Array
},
    {timestamps: true}
);


const Exam = mongoose.model('exams', ExamSchema);

module.exports =  Exam;