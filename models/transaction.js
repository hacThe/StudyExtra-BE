const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const TransactionSchema = new Schema ({
    userID: [{ type: Schema.Types.ObjectId, ref: "chapters" }],
    username: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    context:{
        transactionNumber: String,
        bankSend: String,
        bankReceive: String,
    },
    note: String
},
    { timestamps: true }
);

const Transaction = mongoose.model('transaction', TransactionSchema);
module.exports = Transaction;