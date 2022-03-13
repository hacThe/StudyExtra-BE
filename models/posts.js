const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const PostsSchema = new Schema ({
    _id:{
        postId: String,
    },
    name: String,
    description: String,
    imgUrl: String,
    comment: Array,
    react: Array,
},
    { timestamps: true }
);

const Post = mongoose.model('posts', PostsSchema);
module.exports = Post;