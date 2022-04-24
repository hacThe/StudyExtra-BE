const Article = require("../models/article");
const User = require("../models/users");

class ArticleController {
    getAllArticles = async (req, res) => {
        var dataArticle;
        await Article.find().exec()
        .then((data) => {  
            dataArticle = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        console.log("dataArticle[0].userID", dataArticle[0].userID); 
        var newI = await User.findOne({_id: dataArticle[0].userID});
        if(newI!=null) {
            console.log("find", newI);
        } 
        else console.log("non");

        var summaryData = [
            {
                userID : dataArticle[0].userID,
                content: dataArticle[0].content,
                imgUrl: dataArticle[0].imgUrl,
                comments : dataArticle[0].comments,
                username : !newI.name ? "Không có" : newI.name,
                avatar : !newI.avatar ? "https://img-9gag-fun.9cache.com/photo/axBB4pW_460s.jpg" : newI.avatar,
            }
        ]

        res.status(200).send(
            JSON.stringify({
                data: summaryData
            })
        )
    }   
}

module.exports = new ArticleController();