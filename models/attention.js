const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const AttentionSchema = new Schema({
    username: String,
    examID: String,
    score: Number,
    testRound: Number,
    userAnswer: Array
},
    {timestamps: true}
);

const Attention = mongoose.model('attention', AttentionSchema);
module.exports =  Attention;