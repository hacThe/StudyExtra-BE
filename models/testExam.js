const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const TestExamSchema = new Schema ({
    nameExam: {
        type: String,
        required: true,
    },
    questionPoint: Number,
    listQuestion: Array,
    time: Number,//phút,
    typeCategory: String
},
    { timestamps: true }
);

const TestExam = mongoose.model('testExam', TestExamSchema);

module.exports =  TestExam;