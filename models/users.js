const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: String,
    phone: String,
    role: String,
    mail: String,
    emailVerified: Boolean,
    avatar: String,
    courseID: [{ type: Schema.Types.ObjectId, ref: "courses" }],
    examID: [{ type: Schema.Types.ObjectId, ref: "exams" }],
    gem: Number,
    birthday: Date,
    pointID: Array,
    gender: String,
    isLock: Boolean, // Check xem tài khoản có đang khóa hay không
    transactions: [{ type: Schema.Types.ObjectId, ref: "transactions" }],
},
    { timestamps: true }
);

const User = mongoose.model('users', UserSchema);
module.exports = User;