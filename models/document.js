const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const DocumentSchema = new Schema ({
    _id:{
        documentID: String,
    },
    name: String,
    typeID: Array,
    views: Number,
},
    { timestamps: true }
);

const Document = mongoose.model('document', DocumentSchema);
module.exports = Document;