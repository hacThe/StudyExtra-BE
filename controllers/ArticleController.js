const Article = require("../models/article");
class ArticleController {
    getAllArticles = async (req, res) => {
        console.log("Vô đúng router rồi");
        Article.find().exec()
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

module.exports = new ArticleController();