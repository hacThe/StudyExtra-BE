const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const ArticleSchema = new Schema ({
    userID: String,
    content: String,
    imgUrl: [
        {
            concreteImgUrl: String
        }
    ],
    comments: [
        {
            commentID: String,
            userID: String,
            content: String,
            type: String,
            userTagID: String,
        }
    ],    
},
    { timestamps: true }
);

const Article = mongoose.model('article', ArticleSchema);
module.exports = Article;