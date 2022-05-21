const Article = require("../models/article");
const User = require("../models/users");
var mongoose = require('mongoose');
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

        // console.log("dataArticle[0].userID", dataArticle[0].userID); 
        // var newI = await User.findOne({_id: dataArticle[0].userID});
        // if(newI!=null) {
        //     console.log("find", newI);
        // } 
        // else console.log("non");

        var userData;
        await User.find().exec()
        .then((data) => {  
            userData = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var summaryData = [];
        for(var i = 0; i < dataArticle.length; i++){
            var currentData = {
                ...dataArticle[i]._doc,
                userID : dataArticle[i].userID,
                content: dataArticle[i].content,
                imgUrl: dataArticle[i].imgUrl,
                comments : dataArticle[i].comments,
            }
            var isFindUser = false;
            for(var j = 0; j < userData.length; j++){
                if(dataArticle[i].userID == userData[j]._id){
                    isFindUser = true;
                    currentData.username = userData[j].username,
                    currentData.avatar = userData[j].avatar;
                    currentData.name = userData[j].name;
                    break;
                }
            }
            if(isFindUser){
                summaryData.push(currentData);
            }
        }

        // var summaryData = [
        //     {
        //         userID : dataArticle[0].userID,
        //         content: dataArticle[0].content,
        //         imgUrl: dataArticle[0].imgUrl,
        //         comments : dataArticle[0].comments,
        //         username : !newI.name ? "Không có" : newI.name,
        //         avatar : !newI.avatar ? "https://img-9gag-fun.9cache.com/photo/axBB4pW_460s.jpg" : newI.avatar,
        //     }
        // ]

        res.status(200).send(
            JSON.stringify({
                data: summaryData
            })
        )
    }   

    addArticles = async (req, res) => {
        console.log("req.body", req.body);
        var newArticle = new Article({    
            _id: mongoose.Types.ObjectId(),
            userID: req.body.userID,
            content: req.body.content,
            imgUrl: req.body.imgUrl,
            comments: req.body.comments,
        })

        var userData;
        await User.find().exec()
        .then((data) => {  
            userData = data;
        })
        .catch((error) => {
            res.status(404).send(error);
        })

        var username = "";
        var userAvatar = "";
        var name = "";

        for(var j = 0; j < userData.length; j++){
            if(newArticle.userID == userData[j]._id){
                username = userData[j].username,
                userAvatar = userData[j].avatar;
                name = userData[j].name;
                break;
            }
        }

        newArticle.save()
        .then((data) =>{
            res.status(200).send({
                success: true,
                data: {
                    ...data._doc,
                    username: username,
                    name: name,
                    avatar:userAvatar,
                },
            });
        })
        .catch((error)=>{
            console.log("error", error)
            res.status(404).send({success:false});
        })
        // res.status(200).send({run:true});
    }

    editArticle = async (req, res) => {
        console.log("req.body", req.body);


        await Article.findOneAndUpdate({_id: req.body._id}, 
            {
                content: req.body.content,
                imgUrl: req.body.imgUrl,
            }
        )
        .then((data) => {
            
        })
        .catch((err) => {
            res.status(404).send({run: false, err: err});
        });

        var newI = await Article.findById(req.body._id);
        // if(!newI)
        //     res.status(404).send({find: false});
        
        console.log("newI", newI)
        var dataReturn = {...newI._doc};
        // var isFind = false;
        // var userData;

        await User.findById(newI.userID).exec()
            .then((data) => {  
                // userData = data;
                // isFind = true;
                console.log("data",data);
                dataReturn.username = data.username;
                dataReturn.name = data.name;
                dataReturn.avatar = data.avatar;
                res.status(200).send(
                    JSON.stringify({
                        data: dataReturn,
                    })
                );
            })
            .catch((error) => {
                res.status(404).send(error);
            })
        
            
        // console.log("userData", userData)
        // res.status(200).send({run:true});

    }

    deleteArticles = async (req, res) => {
        console.log("req.body", req.body);
        Article.findOneAndDelete({_id: req.body._id})
        .then((data) => {
            res.status(200).send(
                JSON.stringify({
                    data,
                })
            );
        })
        .catch((err) => {
            res.status(404).send({run: false, err: err});
        });
        // res.status(200).send({run:true});
    }
}

module.exports = new ArticleController();