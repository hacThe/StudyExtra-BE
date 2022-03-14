const Post = require("../models/posts");
class PostsController {
    getAllPosts = async (req, res) => {
        Post.find().exec()
        .then((data) => {
            res.status(200).send(
                JSON.stringify({
                    data: data
                })
            )
        })
        .catch((error) => {
            res.status(404).send(error);
        })
    }   
}

module.exports = new PostsController();